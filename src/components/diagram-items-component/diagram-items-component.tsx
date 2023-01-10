import { faPlus, faPenToSquare, faDeleteLeft, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { DiagramItem, DiagramItemType } from '../../models/diagram'
import CanvasContainer, { DrawableItem, DrawType, Position } from '../canvas-container/canvas-container'
import { writeTextsAndAdjustPosition } from '../canvas-container/text-utils'
import { roundRect } from '../canvas-container/utils'
import Card from '../card'
import { CanvasParentContainer, ButtonContainer, ItemTitleNameContainer, DiagramItemConfirmDeleteBody } from './style'
import AddDiagramItemDialog from './add-diagram-item-dialog'
import Dialog from '../dialog'

interface DiagramItemsComponentProps {
  diagramItems: DiagramItem[]
  onDiagramItemChange: (updatedDiagramItems: DiagramItem[]) => void
  onDiagramItemAdded: (diagramItem: DiagramItem) => void
  onDiagramItemDeleted: (diagramItems: DiagramItem[]) => void
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

let createdItemCount = 0

const DiagramItemsComponent: FC<DiagramItemsComponentProps> = ({ diagramItems, onDiagramItemChange, onDiagramItemAdded, onDiagramItemDeleted }: DiagramItemsComponentProps) => {
  const componentRef = useRef<HTMLElement>(null)
  const [drawableItems, setDrawableItems] = useState<DrawableItem[]>([])
  const [selectedDiagramItems, setSelectedDiagramItems] = useState<DiagramItem[]>([])
  const [showItemDialog, setShowItemDialog] = useState<boolean>(false)
  const [diagramItemToDialog, setDiagramItemToDialog] = useState<DiagramItem | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [isLinkingItem, setIsLinkingItem] = useState<boolean>(false)

  useEffect(() => {
    console.log('will instantiate items', diagramItems)
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
    const newItems = diagramItems.filter(diagramItem => diagramItem.key !== undefined).map(diagramItem => {
      const position = getPositionByDiagramItem(diagramItem)
      const itemType = DiagramItemType[diagramItem.itemType]
      const color = getColorByDiagramItem(diagramItem)

      return {
        id: diagramItem.key !== undefined ? diagramItem.key : 'only to avoid error',
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

    diagramItems.filter(diagramItem => diagramItem.key !== undefined).forEach(diagramItem => {

    })

    setDrawableItems(newItems)
  }

  const onItemPositionChange = (item: DrawableItem, newPosition: Position): void => {
    const diagramItem = diagramItems.find(d => d.key === item.id)

    if (diagramItem === undefined) {
      console.error('diagram item modified but not found')
      return
    }

    diagramItem.canvasData.position = { x: newPosition.x, y: newPosition.y, width: item.position.width, height: item.position.height }
    diagramItem.isSelected = item.isSelected

    onDiagramItemChange([diagramItem])
  }

  const handleLinkSelection = (items: DrawableItem[]): void => {
    if (selectedDiagramItems.length !== 1) {
      return
    }

    const previouslySelectedItem = selectedDiagramItems[0]
    const selectedDrawbleItem = items[0]
    const selectedDiagramItem = diagramItems.find(d => d.key === selectedDrawbleItem.id)

    if (selectedDiagramItem === undefined) return

    previouslySelectedItem.relationships.push({
      diagramItem: selectedDiagramItem,
      description: '',
      details: ''
    })

    setIsLinkingItem(false)
    onDiagramItemChange([previouslySelectedItem])
  }

  const onItemSelectionChange = (items: DrawableItem[]): void => {
    const itemsMap = new Map()
    items.filter(item => item.id).forEach(item => {
      itemsMap.set(item.id, item)
    })

    if (isLinkingItem) {
      handleLinkSelection(items)
      return
    }

    const newDiagramItems = diagramItems.map(diagramItem => {
      const drawableItem = itemsMap.get(diagramItem.key)
      diagramItem.isSelected = drawableItem.isSelected
      return diagramItem
    })

    onDiagramItemChange(newDiagramItems)
    setSelectedDiagramItems(newDiagramItems.filter(i => i.isSelected))
  }

  const onAddItemClick = (): void => {
    setShowItemDialog(true)
    setDiagramItemToDialog(null)
  }

  const onEditItemClick = (): void => {
    setShowItemDialog(true)
    setDiagramItemToDialog(selectedDiagramItems.length === 1 ? selectedDiagramItems[0] : null)
  }

  const onDeleteItemClick = (): void => {
    setShowDeleteConfirmation(true)
  }

  const onLinkItemClick = (): void => {
    setIsLinkingItem(!isLinkingItem)
  }

  const onAddItemDialogOkClick = (diagramItem: DiagramItem): void => {
    const isCreation = diagramItem.key === undefined

    if (isCreation) {
      console.log('diagramItem created', diagramItem)
      diagramItem.key = `CREATED_NOT_PERSISTED_${createdItemCount++}`
      onDiagramItemAdded(diagramItem)
    } else {
      console.log('diagramItem updated')
      onDiagramItemChange([diagramItem])
    }

    setShowItemDialog(false)
  }

  const onAddItemDialogCancelClick = (): void => {
    setShowItemDialog(false)
  }

  const onDeleteItemDialogOkClick = (): void => {
    setShowDeleteConfirmation(false)
    onDiagramItemDeleted(selectedDiagramItems)
    setSelectedDiagramItems([])
  }

  const onDeleteItemDialogCancelClick = (): void => {
    setShowDeleteConfirmation(false)
  }

  const renderConfirmItemDeletionDialog = (): ReactElement | null => {
    if (!showDeleteConfirmation) return null

    return (
      <Dialog show={showDeleteConfirmation} onOkClick={onDeleteItemDialogOkClick} onCancelClick={onDeleteItemDialogCancelClick}>
        <DiagramItemConfirmDeleteBody>
          Do you want to delete the following items ? <br />
          {selectedDiagramItems.map((item, index) => {
            return (
              <div key={`item-name-to-delete-confirmation-${index}`}>
                <br />
                {item.name}
              </div>
            )
          })}
        </DiagramItemConfirmDeleteBody>
      </Dialog>
    )
  }

  const renderItemDialog = (): ReactElement => {
    return (
      <AddDiagramItemDialog
        diagramItem={diagramItemToDialog}
        show={showItemDialog}
        onOkClick={onAddItemDialogOkClick}
        onCancelClick={onAddItemDialogCancelClick} />
    )
  }

  const renderButtonsForSelection = (): ReactElement | null => {
    if (selectedDiagramItems.length === 0) return null

    return (
      <>
        <Card key='diagram-button-edit-item' description={'edit'} onClick={onEditItemClick}>
          <FontAwesomeIcon icon={faPenToSquare} size="1x" />
        </Card>
        <Card key='diagram-button-delete-item' description={'delete'} onClick={onDeleteItemClick}>
          <FontAwesomeIcon icon={faDeleteLeft} size="1x" />
        </Card>
        <Card key='diagram-button-link-item' description={'link'} onClick={onLinkItemClick}>
          <FontAwesomeIcon icon={faLink} size="1x" />
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
          onItemSelectionChange={onItemSelectionChange}
          drawLineToMouse={isLinkingItem} />
      </CanvasParentContainer>

      {renderItemDialog()}
      {renderConfirmItemDeletionDialog()}
    </>

  )
}

export default DiagramItemsComponent
