import { DiagramItem, DiagramItemPosition } from '../../models/diagram'
import { getDisplayPosition } from '../../models/diagram-utils'
import { WorkspaceItemType } from '../../models/workspace'
import { getBoolean, getString } from '../../utils/typing-utils'
import { DrawableItem, DrawType } from '../canvas-container/models'
import { generateComponentComponent, generateContainer, generateDatabaseContainer, generateMobileContainer, generateRelationshipComponent, generateUserComponent, generateWebContainer } from './component_utils'

const SIZE_BY_ITEM_TYPE = new Map()
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.PERSONA], { width: 300, height: 300 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.ENTITY], { width: 200, height: 100 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.CONTAINER], { width: 300, height: 180 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.WEB_CONTAINER], { width: 300, height: 180 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.MOBILE_CONTAINER], { width: 300, height: 180 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.COMPONENT], { width: 150, height: 150 })
SIZE_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.DATABASE], { width: 150, height: 150 })

const COLOR_BY_ITEM_TYPE = new Map()
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.PERSONA], '#116611')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.ENTITY], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.CONTAINER], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.WEB_CONTAINER], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.MOBILE_CONTAINER], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.COMPONENT], '#55aa55')
COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.DATABASE], '#55aa55')

const SECONDARY_COLOR_BY_ITEM_TYPE = new Map()
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.PERSONA], '#116611')
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.ENTITY], '#55aa55')
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.CONTAINER], '#7bdb7b')
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.WEB_CONTAINER], '#7bdb7b')
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.MOBILE_CONTAINER], '#7bdb7b')
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.COMPONENT], '#55aa55')
SECONDARY_COLOR_BY_ITEM_TYPE.set(WorkspaceItemType[WorkspaceItemType.DATABASE], '#55aa55')

// const MARGIN_CHILDREN_COMPONENTS = 100
// const DEFAULT_OPENED_ITEM_PROPORTION_SIZE = { width: 2.5, height: 2.5 }

// const getPositionByDiagramItem = (diagramItem: DiagramItem): Position => {
//   const strType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
//   const dimension = SIZE_BY_ITEM_TYPE.get(strType)

//   // todo - define the square center as default x, y
//   const position = { x: 10, y: 200, width: dimension.width, height: dimension.height }
//   const diagramItemPosition = diagramItem.data.displayPosition != null ? diagramItem.data.displayPosition : diagramItem.data.position

//   if (diagramItemPosition !== null) {
//     position.x = diagramItemPosition.x
//     position.y = diagramItemPosition.y
//     position.width = diagramItemPosition.width
//     position.height = diagramItemPosition.height
//   }

//   return position
// }

export const getDefaultPositionByType = (workspaceItemType: WorkspaceItemType, position: DiagramItemPosition | null): DiagramItemPosition => {
  const itemPosition = position ?? {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }

  const itemDimensions = SIZE_BY_ITEM_TYPE.get(workspaceItemType)
  itemPosition.width = itemDimensions.width
  itemPosition.height = itemDimensions.height

  if (position !== null) {
    itemPosition.x = itemPosition.x - itemPosition.width / 2
    itemPosition.y = itemPosition.y - itemPosition.height / 2
  }

  return itemPosition
}

const getColorByDiagramItem = (diagramItem: DiagramItem): string => {
  const strType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
  return diagramItem.data.color !== null ? diagramItem.data.color : COLOR_BY_ITEM_TYPE.get(strType)
}

const getSecondaryColorByDiagramItem = (diagramItem: DiagramItem): string => {
  const strType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
  return diagramItem.data.color !== null ? diagramItem.data.color : SECONDARY_COLOR_BY_ITEM_TYPE.get(strType)
}

const convertDiagramItemToDrawableItem = (diagramItem: DiagramItem): DrawableItem => {
  const position = getDisplayPosition(diagramItem)
  const itemType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
  const color = getColorByDiagramItem(diagramItem)

  return {
    id: diagramItem.workspaceItem.key,
    type: DrawType.IMG,
    img: null,
    position,
    isSelected: getBoolean(diagramItem.isSelected),
    isOpened: getBoolean(diagramItem.isOpened),
    name: diagramItem.workspaceItem.name,
    description: getString(diagramItem.workspaceItem.description),
    details: getString(diagramItem.workspaceItem.details),
    color,
    children: [],
    drawItem: (context: CanvasRenderingContext2D, isOpened: boolean, children: DrawableItem[]) => {
      const texts = [diagramItem.workspaceItem.name]

      if (!isOpened) {
        texts.push(getString(diagramItem.workspaceItem.description))
        texts.push(getString(diagramItem.workspaceItem.details))
      }

      const secondaryColor = getSecondaryColorByDiagramItem(diagramItem)

      switch (itemType) {
        case WorkspaceItemType[WorkspaceItemType.PERSONA]:
          return generateUserComponent(context, position, texts)
        case WorkspaceItemType[WorkspaceItemType.CONTAINER]:
          return generateContainer(context, position, texts, isOpened)
        case WorkspaceItemType[WorkspaceItemType.COMPONENT]:
          return generateComponentComponent(context, position, texts)
        case WorkspaceItemType[WorkspaceItemType.DATABASE]:
          return generateDatabaseContainer(context, position, texts)
        case WorkspaceItemType[WorkspaceItemType.WEB_CONTAINER]:
          return generateWebContainer(context, position, texts, secondaryColor)
        case WorkspaceItemType[WorkspaceItemType.MOBILE_CONTAINER]:
          return generateMobileContainer(context, position, texts, secondaryColor)
        default:
          return generateUserComponent(context, position, texts)
      }
    }
  }
}

const convertDiagramItemAndChildrenToDrawableItems = (diagramItem: DiagramItem): DrawableItem[] => {
  const drawableItems: DrawableItem[] = [convertDiagramItemToDrawableItem(diagramItem)]

  if (getBoolean(diagramItem.isOpened)) {
    diagramItem.children.forEach(childDiagramItem => {
      drawableItems.push(...convertDiagramItemAndChildrenToDrawableItems(childDiagramItem))
    })
  }

  return drawableItems
}

const getDiagramItemByKey = (diagramItems: DiagramItem[], diagramItemKey: string): DiagramItem | undefined => {
  return diagramItems.find(diagramItem => diagramItem.workspaceItem.key === diagramItemKey)
}

// const convertChildrenDiagramItemsToDrawableItems = (diagramItems: DiagramItem[], parent: DiagramItem): DrawableItem[] => {
//   const childrenDiagramItems = diagramItems.filter(d => d.parent?.id === parent.id)
//   if (childrenDiagramItems.length === 0) {
//     return [convertDiagramItemToDrawableItem(parent)]
//   }

//   const parentDrawableItem = convertDiagramItemToDrawableItem(parent)
//   const resultDiagramItems: DrawableItem[] = [parentDrawableItem]
//   childrenDiagramItems.forEach(child => {
//     parentDrawableItem.children.push(...convertChildrenDiagramItemsToDrawableItems(diagramItems, child))
//   })

//   return resultDiagramItems
// }

// const filterParentDiagramItems = (diagramItems: DiagramItem[]): DiagramItem[] => {
//   return diagramItems.filter(diagramItem => diagramItem.parent == null)
// }

const generateRelationshipDrawableItems = (diagramItem: DiagramItem, diagramItems: DiagramItem[]): DrawableItem[] => {
  const sourceItemPosition = getDisplayPosition(diagramItem)

  if (sourceItemPosition == null) {
    return []
  }

  const drawableItems: DrawableItem[] = []

  diagramItem.relationships.forEach(relationship => {
    const targetItem = getDiagramItemByKey(diagramItems, relationship.diagramItem.workspaceItem.key)
    if (targetItem == null) {
      return
    }

    const targetKey = targetItem.workspaceItem.key
    const targetItemPosition = getDisplayPosition(targetItem)

    if (targetItemPosition == null) {
      return null
    }

    drawableItems.push({
      id: `RELATIONSHIP_FROM_${diagramItem.workspaceItem.key}_TO_${targetKey}`,
      type: DrawType.LINE,
      img: null,
      position: relationship.data.fromPosition,
      isSelected: diagramItem.isSelected !== undefined ? diagramItem.isSelected : false,
      isOpened: false,
      name: `Relationship from ${diagramItem.workspaceItem.name} to ${targetItem.workspaceItem.name}`,
      description: relationship.description,
      details: relationship.details,
      color: '#000000',
      children: [],
      drawItem: (context: CanvasRenderingContext2D) => {
        const texts = [relationship.description, relationship.details]
        generateRelationshipComponent(context, texts, relationship, sourceItemPosition, targetItemPosition)
      }
    })
  })

  return drawableItems
}

export const convertDiagramItemsToDrawableItems = (diagramItems: DiagramItem[]): DrawableItem[] => {
  // const parentDiagramItems = filterParentDiagramItems(diagramItems)
  const drawableItems: DrawableItem[] = []
  diagramItems.forEach(diagramItem => {
    drawableItems.push(...convertDiagramItemAndChildrenToDrawableItems(diagramItem))
  })

  // parentDiagramItems.forEach(parentDiagramItem => {
  //   drawableItems.push(...convertChildrenDiagramItemsToDrawableItems(diagramItems, parentDiagramItem))
  // })

  diagramItems.filter(diagramItem => diagramItem.workspaceItem.key !== undefined).forEach(diagramItem => {
    drawableItems.push(...generateRelationshipDrawableItems(diagramItem, diagramItems))
  })

  return drawableItems
}
