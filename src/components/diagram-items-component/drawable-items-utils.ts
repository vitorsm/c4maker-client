import { DiagramItem } from '../../models/diagram'
import { WorkspaceItemType } from '../../models/workspace'
import { DrawableItem, DrawType, Position } from '../canvas-container/models'
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

const getSecondaryColorByDiagramItem = (diagramItem: DiagramItem): string => {
  const strType = WorkspaceItemType[diagramItem.workspaceItem.workspaceItemType]
  return diagramItem.data.color !== null ? diagramItem.data.color : SECONDARY_COLOR_BY_ITEM_TYPE.get(strType)
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
      const secondaryColor = getSecondaryColorByDiagramItem(diagramItem)

      switch (itemType) {
        case WorkspaceItemType[WorkspaceItemType.PERSONA]:
          return generateUserComponent(context, position, texts)
        case WorkspaceItemType[WorkspaceItemType.CONTAINER]:
          return generateContainer(context, position, texts)
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

const getDiagramItemByKey = (diagramItems: DiagramItem[], diagramItemKey: string): DiagramItem | undefined => {
  return diagramItems.find(diagramItem => diagramItem.workspaceItem.key === diagramItemKey)
}

export const convertDiagramItemsToDrawableItems = (diagramItems: DiagramItem[]): DrawableItem[] => {
  const drawableItems = diagramItems.filter(diagramItem => diagramItem.workspaceItem.key !== undefined).map(diagramItem => {
    return convertDiagramItemToDrawableItem(diagramItem)
  })

  diagramItems.filter(diagramItem => diagramItem.workspaceItem.key !== undefined).forEach(diagramItem => {
    const sourceItemPosition = diagramItem.data.position

    if (sourceItemPosition == null) {
      return null
    }

    diagramItem.relationships.forEach(relationship => {
      const targetItem = getDiagramItemByKey(diagramItems, relationship.diagramItem.workspaceItem.key)
      if (targetItem == null) {
        return
      }

      const targetKey = targetItem.workspaceItem.key
      const targetItemPosition = targetItem.data.position

      if (targetItemPosition == null) {
        return null
      }

      drawableItems.push({
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

  return drawableItems
}
