import { faPlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { DiagramItem, DiagramItemType } from '../../models/diagram'
import CanvasContainer, { DrawableItem, DrawType, Position } from '../canvas-container/canvas-container'
import { writeTextsAndAdjustPosition } from '../canvas-container/text-utils'
import { roundRect } from '../canvas-container/utils'
import Card from '../card'
import { CanvasParentContainer, ButtonContainer, ItemTitleNameContainer } from './style'
import AddDiagramItemDialog from './add-diagram-item-dialog'

interface DiagramItemsComponentProps {
  diagramItems: DiagramItem[]
  onDiagramItemChange: (updatedDiagramItems: DiagramItem[]) => void
}

const CANVAS_WIDTH = 2246
const CANVAS_HEIGHT = 1324
// const BUTTONS_HEIGHT = 80

const SIZE_BY_ITEM_TYPE = new Map()
SIZE_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.PERSON], { width: 300, height: 300 })
SIZE_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.SOFTWARE_SYSTEM], { width: 200, height: 100 })
SIZE_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.CONTAINER], { width: 300, height: 180 })
SIZE_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.COMPONENT], { width: 150, height: 150 })

const COLOR_BY_ITEM_TYPE = new Map()
COLOR_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.PERSON], '#116611')
COLOR_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.SOFTWARE_SYSTEM], '#55aa55')
COLOR_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.CONTAINER], '#55aa55')
COLOR_BY_ITEM_TYPE.set(DiagramItemType[DiagramItemType.COMPONENT], '#55aa55')

const DiagramItemsComponent: FC<DiagramItemsComponentProps> = ({ diagramItems, onDiagramItemChange }: DiagramItemsComponentProps) => {
  const componentRef = useRef<HTMLElement>(null)
  const [drawableItems, setDrawableItems] = useState<DrawableItem[]>([])
  const [selectedDiagramItems, setSelectedDiagramItems] = useState<DiagramItem[]>([])
  const [showItemDialog, setShowItemDialog] = useState<boolean>(false)

  useEffect(() => {
    instantiateDrawItems()
  }, [diagramItems])

  const generateUserComponent = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
    const circleRadius = position.height * 0.23
    const circleX = position.x + position.width / 2
    const startBoxY = 0.8 * circleRadius * 2
    const boxHeight = position.height - circleRadius * 2 * 0.8
    const borderRadius = 50
    const topPadding = 10
    const leftPadding = 2

    const boxPosition = { x: position.x, y: position.y + startBoxY, width: position.width, height: boxHeight }

    context.beginPath()
    context.arc(circleX, position.y + circleRadius, circleRadius, 0, 2 * Math.PI)
    roundRect(context, boxPosition.x, boxPosition.y, boxPosition.width, boxPosition.height, borderRadius)
    context.closePath()

    writeTextsAndAdjustPosition(context, texts, boxPosition, topPadding, leftPadding, borderRadius)
  }

  const generateContainerComponent = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
    const topPadding = 10
    const leftPadding = 2
    const borderRadius = 10

    context.beginPath()
    roundRect(context, position.x, position.y, position.width, position.height, borderRadius)
    context.closePath()

    writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius)
  }

  const getPositionByDiagramItem = (diagramItem: DiagramItem): Position => {
    const strType = DiagramItemType[diagramItem.itemType]
    const dimension = SIZE_BY_ITEM_TYPE.get(strType)

    const position = { x: 10, y: 200, width: dimension.width, height: dimension.height }

    if (diagramItem.canvasData.position !== null) {
      position.x = diagramItem.canvasData.position.x
      position.y = diagramItem.canvasData.position.y
    }

    return position
  }

  const getColorByDiagramItem = (diagramItem: DiagramItem): string => {
    const strType = DiagramItemType[diagramItem.itemType]
    return diagramItem.canvasData.color !== null ? diagramItem.canvasData.color : COLOR_BY_ITEM_TYPE.get(strType)
  }

  const instantiateDrawItems = (): void => {
    const newItems = diagramItems.filter(diagramItem => diagramItem.id !== undefined).map(diagramItem => {
      const position = getPositionByDiagramItem(diagramItem)
      const itemType = DiagramItemType[diagramItem.itemType]
      const color = getColorByDiagramItem(diagramItem)

      return {
        id: diagramItem.id !== undefined ? diagramItem.id : 'only to avoid error',
        type: DrawType.IMG,
        img: null,
        position,
        isSelected: diagramItem.isSelected !== undefined ? diagramItem.isSelected : false,
        name: diagramItem.name,
        description: diagramItem.itemDescription,
        details: diagramItem.details,
        color,
        drawItem: (context: CanvasRenderingContext2D) => {
          const texts = [diagramItem.name, diagramItem.itemDescription, diagramItem.details]

          switch (itemType) {
            case DiagramItemType[DiagramItemType.PERSON]:
              return generateUserComponent(context, position, texts)
            case DiagramItemType[DiagramItemType.CONTAINER]:
              return generateContainerComponent(context, position, texts)
            default:
              return generateUserComponent(context, position, texts)
          }
        }
      }
    })

    setDrawableItems(newItems)
  }

  const onItemPositionChange = (item: DrawableItem, newPosition: Position): void => {
    const diagramItem = diagramItems.find(d => d.id === item.id)

    if (diagramItem === undefined) {
      console.error('diagram item modified but not found')
      return
    }

    diagramItem.canvasData.position = { x: newPosition.x, y: newPosition.y, width: item.position.width, height: item.position.height }
    diagramItem.isSelected = item.isSelected

    onDiagramItemChange([diagramItem])
  }

  const onItemSelectionChange = (items: DrawableItem[]): void => {
    const itemsMap = new Map()
    items.forEach(item => {
      itemsMap.set(item.id, item)
    })

    const newDiagramItems = diagramItems.map(diagramItem => {
      const drawableItem = itemsMap.get(diagramItem.id)
      diagramItem.isSelected = drawableItem.isSelected
      return diagramItem
    })

    onDiagramItemChange(newDiagramItems)
    setSelectedDiagramItems(newDiagramItems.filter(i => i.isSelected))
  }

  const onAddItemClick = (): void => {
    setShowItemDialog(true)
  }

  const onAddItemDialogOkClick = (): void => {

  }

  const onAddItemDialogCancelClick = (): void => {
    setShowItemDialog(false)
  }

  const renderItemDialog = (): ReactElement => {
    const selectedItem = selectedDiagramItems.length === 1 ? selectedDiagramItems[0] : null

    return (
      <AddDiagramItemDialog
        diagramItem={selectedItem}
        show={showItemDialog}
        onOkClick={onAddItemDialogOkClick}
        onCancelClick={onAddItemDialogCancelClick} />
    )
  }

  const renderButtonsForSelection = (): ReactElement | null => {
    if (selectedDiagramItems.length === 0) return null

    return (
      <>
        <Card key='diagram-button-edit-item' description={'edit'}>
          <FontAwesomeIcon icon={faPenToSquare} size="1x" />
        </Card>
        <Card key='diagram-button-delete-item' description={'delete'}>
          <FontAwesomeIcon icon={faPenToSquare} size="1x" />
        </Card>
        <ItemTitleNameContainer>
          {selectedDiagramItems.map(i => i.name).join(', ')}
        </ItemTitleNameContainer>
      </>
    )
  }

  return (
    <>
      <ButtonContainer>
        <Card key='diagram-button-create-new-item' description={'add'} onClick={onAddItemClick}>
          <FontAwesomeIcon icon={faPlus} size="1x" />
        </Card>

        {renderButtonsForSelection()}

      </ButtonContainer>
      <CanvasParentContainer ref={componentRef}>
        <CanvasContainer
          drawableItems={drawableItems}
          canvasWidth={CANVAS_WIDTH}
          canvasHeight={CANVAS_HEIGHT}
          parentComponentRef={componentRef}
          onItemPositionChange={onItemPositionChange}
          onItemSelectionChange={onItemSelectionChange} />
      </CanvasParentContainer>

      {renderItemDialog()}
    </>

  )
}

export default DiagramItemsComponent
