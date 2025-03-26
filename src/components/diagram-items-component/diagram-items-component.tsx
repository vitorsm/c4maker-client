import { faPlus, faPenToSquare, faDeleteLeft, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { DiagramItem } from '../../models/diagram'
import CanvasContainer from '../canvas-container/canvas-container'
import { DrawableItem, DrawType, Position } from '../canvas-container/models'

import Card from '../card'
import { CanvasParentContainer, ButtonContainer, ItemTitleNameContainer, DiagramItemConfirmDeleteBody } from './style'
import AddDiagramItemDialog from './add-diagram-item-dialog'
import Dialog from '../dialog'
import { generateContainerComponent, generateRelationshipComponent, generateUserComponent } from './component_utils'
import { WorkspaceItemType } from '../../models/workspace'

interface DiagramItemsComponentProps {
  diagramItems: DiagramItem[]
  onDiagramItemChange: (updatedDiagramItems: DiagramItem[]) => void
  onDiagramItemAdded: (diagramItem: DiagramItem) => void
  onDiagramItemDeleted: (diagramItems: DiagramItem[]) => void
  onDiagramItemSelected: (diagramItems: DiagramItem[]) => void
}

const CANVAS_WIDTH = 2246
const CANVAS_HEIGHT = 1324

const SIZE_BY_ITEM_TYPE = new Map()
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.PERSONA], { width: 300, height: 300 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.ENTITY], { width: 200, height: 100 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.CONTAINER], { width: 300, height: 180 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.COMPONENT], { width: 150, height: 150 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.DATABASE], { width: 150, height: 150 })

const COLOR_BY_ITEM_TYPE = new Map()
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.PERSONA], '#116611')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.ENTITY], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.CONTAINER], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.COMPONENT], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.DATABASE], '#55aa55')

// const createdItemCount = 0

const DiagramItemsComponent: FC<DiagramItemsComponentProps> = ({ diagramItems, onDiagramItemChange, onDiagramItemAdded, onDiagramItemDeleted, onDiagramItemSelected }: DiagramItemsComponentProps) => {
  const componentRef = useRef<HTMLElement>(null)
  const [drawableItems, setDrawableItems] = useState<DrawableItem[]>([])
  const [selectedDiagramItems, setSelectedDiagramItems] = useState<DiagramItem[]>([])
  const [showItemDialog, setShowItemDialog] = useState<boolean>(false)
  const [diagramItemToDialog, setDiagramItemToDialog] = useState<DiagramItem | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false)
  const [isLinkingItem, setIsLinkingItem] = useState<boolean>(false)

  useEffect(() => {
    instantiateDrawItems()
  }, [diagramItems])

  const getPositionByDiagramItem = (diagramItem: DiagramItem): Position => {
    const strType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
    const dimension = SIZE_BY_ITEM_TYPE.get(strType)

    // todo - define the square center as default x, y
    const position = { x: 10, y: 200, width: dimension.width, height: dimension.height }

    if (diagramItem.data.position !== null) {
      position.x = diagramItem.data.position.x
      position.y = diagramItem.data.position.y
    }

    return position
  }

  const getColorByDiagramItem = (diagramItem: DiagramItem): string => {
    const strType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
    return diagramItem.data.color !== null ? diagramItem.data.color : COLOR_BY_ITEM_TYPE.get(strType)
  }

  const convertDiagramItemToDrawableItem = (diagramItem: DiagramItem): DrawableItem => {
    const position = getPositionByDiagramItem(diagramItem)
    const itemType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
    const color = getColorByDiagramItem(diagramItem)

    return {
      id: diagramItem.workspaceItem.key,
      type: DrawType.IMG,
      img: null,
      position,
      isSelected: diagramItem.isSelected !== undefined ? diagramItem.isSelected : false,
      name: diagramItem.workspaceItem.name,
      description: diagramItem.workspaceItem.description ?? '',
      details: diagramItem.workspaceItem.details ?? '',
      color,
      drawItem: (context: CanvasRenderingContext2D) => {
        const texts = [diagramItem.workspaceItem.name]
        texts.push(diagramItem.workspaceItem.description ?? '')
        texts.push(diagramItem.workspaceItem.details ?? '')

        switch (itemType) {
          case WorkspaceItemType[WorkspaceItemType.PERSONA]:
            return generateUserComponent(context, position, texts)
          case WorkspaceItemType[WorkspaceItemType.CONTAINER]:
            return generateContainerComponent(context, position, texts)
          default:
            return generateUserComponent(context, position, texts)
        }
      }
    }
  }

  const getDiagramItemFromState = (itemKey: string): DiagramItem | undefined => {
    return diagramItems.find(diagramItem => diagramItem.workspaceItem.key === itemKey)
  }

  const instantiateDrawItems = (): void => {
    const newItems = diagramItems.filter(diagramItem => diagramItem.workspaceItem.key !== undefined).map(diagramItem => {
      return convertDiagramItemToDrawableItem(diagramItem)
    })

    diagramItems.filter(diagramItem => diagramItem.workspaceItem.key !== undefined).forEach(diagramItem => {
      const sourceItemPosition = diagramItem.data.position

      if (sourceItemPosition == null) {
        return null
      }

      diagramItem.relationships.forEach(relationship => {
        const targetItem = getDiagramItemFromState(relationship.diagramItem.workspaceItem.key)
        if (targetItem == null) {
          return
        }

        const targetKey = targetItem.workspaceItem.key
        const targetItemPosition = targetItem.data.position

        if (targetItemPosition == null) {
          return null
        }

        newItems.push({
          id: `RELATIONSHIP_FROM_${diagramItem.workspaceItem.key}_TO_${targetKey}`,
          type: DrawType.LINE,
          img: null,
          position: relationship.data.fromPosition,
          isSelected: diagramItem.isSelected !== undefined ? diagramItem.isSelected : false,
          name: `Relationship from ${diagramItem.workspaceItem.name} to ${targetItem.workspaceItem.name}`,
          description: relationship.description,
          details: relationship.details,
          color: '#000000',
          drawItem: (context: CanvasRenderingContext2D) => {
            const texts = [relationship.description, relationship.details]
            generateRelationshipComponent(context, texts, relationship, sourceItemPosition, targetItemPosition)
          }
        })
      })
    })

    setDrawableItems(newItems)
  }

  const onItemPositionChange = (item: DrawableItem, newPosition: Position): void => {
    const diagramItem = diagramItems.find(d => d.workspaceItem.key === item.id)

    if (diagramItem === undefined) {
      console.error('diagram item modified but not found')
      return
    }

    diagramItem.data.position = { x: newPosition.x, y: newPosition.y, width: item.position.width, height: item.position.height }
    diagramItem.isSelected = item.isSelected

    onDiagramItemChange([diagramItem])
  }

  const onLink = (targetItem: DrawableItem, fromPosition: Position, toPosition: Position): void => {
    if (selectedDiagramItems.length !== 1) {
      console.error('to link components the source should be only 1 item')
      return
    }

    const previouslySelectedItem = selectedDiagramItems[0]
    const selectedDiagramItem = diagramItems.find(d => d.workspaceItem.key === targetItem.id)

    if (selectedDiagramItem === undefined) return

    let sourceX = 0
    let sourceY = 0
    let targetX = 0
    let targetY = 0

    if (previouslySelectedItem.data.position !== null) {
      sourceX = fromPosition.x - previouslySelectedItem.data.position.x
      sourceY = fromPosition.y - previouslySelectedItem.data.position.y
    }
    if (selectedDiagramItem.data.position !== null) {
      targetX = toPosition.x - selectedDiagramItem.data.position.x
      targetY = toPosition.y - selectedDiagramItem.data.position.y
    }

    previouslySelectedItem.relationships.push({
      diagramItem: selectedDiagramItem,
      description: '',
      details: '',
      data: {
        fromPosition: { ...fromPosition, x: sourceX, y: sourceY },
        toPosition: { ...toPosition, x: targetX, y: targetY }
      },
      diagramType: 'C4'
    })

    setIsLinkingItem(false)
    onDiagramItemChange([previouslySelectedItem])
  }

  const onItemSelectionChange = (items: DrawableItem[]): void => {
    const itemsMap = new Map()
    items.filter(item => item.id).forEach(item => {
      itemsMap.set(item.id, item)
    })

    const newDiagramItems = diagramItems.map(diagramItem => {
      const drawableItem = itemsMap.get(diagramItem.workspaceItem.key)
      diagramItem.isSelected = drawableItem.isSelected
      return diagramItem
    })

    // onDiagramItemChange(newDiagramItems)
    const newSelectedDiagramItems = newDiagramItems.filter(i => i.isSelected)
    onDiagramItemSelected(newSelectedDiagramItems)
    setSelectedDiagramItems(newSelectedDiagramItems)
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
    const isCreation = diagramItem.id == null

    if (isCreation) {
      // diagramItem.workspaceItem.key = `CREATED_NOT_PERSISTED_${createdItemCount++}`
      onDiagramItemAdded(diagramItem)
    } else {
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
                {item.workspaceItem.name}
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
          {selectedDiagramItems.map(i => i.workspaceItem.name).join(', ')}
        </ItemTitleNameContainer>
      </>
    )
  }

  return (
    <>
      <ButtonContainer>
        <Card key='diagram-button-create-new-item' description={'add'} onClick={onAddItemClick} dataTestId='diagram-button-create-new-item'>
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
          onLink={onLink}
          drawLineToMouse={isLinkingItem} />
      </CanvasParentContainer>

      {renderItemDialog()}
      {renderConfirmItemDeletionDialog()}
    </>

  )
}

export default DiagramItemsComponent
