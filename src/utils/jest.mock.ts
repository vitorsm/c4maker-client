import { DrawableItem, DrawType, Position } from '../components/canvas-container/models'
import Diagram, { DiagramItem } from '../models/diagram'
import { WorkspaceItemType } from '../models/workspace'

const ITEM_IDS = { drawableItemCount: 0, diagramItemCount: 0 }

export const generateDrawableItem = (position: Position, drawFunction: Function, itemType: DrawType = DrawType.IMG): DrawableItem => {
  const itemCount = ITEM_IDS.drawableItemCount++

  return {
    id: `id_${itemCount}`,
    type: itemType,
    img: null,
    position,
    isSelected: false,
    isOpened: false,
    drawItem: drawFunction,
    name: `name_${itemCount}`,
    details: `details_${itemCount}`,
    description: `description_${itemCount}`,
    color: '#000000',
    children: []
  }
}

export const generateScrollComponentRef = (scrollX: number, scrollY: number): any => {
  return {
    current: {
      scrollLeft: scrollX,
      scrollTop: scrollY
    }
  }
}

export const generatePosition = (x: number, y: number, width: number = 0, height: number = 0): Position => {
  return { x, y, width, height }
}

export const generateDiagramItem = (withPosition?: boolean, itemType?: WorkspaceItemType): DiagramItem => {
  const itemCount = ITEM_IDS.diagramItemCount++

  let position = null
  if (withPosition === true) {
    position = {
      x: 10,
      y: 10,
      width: 100,
      height: 100
    }
  }
  let workspaceItemType = WorkspaceItemType.PERSONA
  if (itemType !== undefined) {
    workspaceItemType = itemType
  }

  const diagramItemDTO = {
    id: `id_${itemCount}`,
    workspaceItem: {
      key: `id_${itemCount}`,
      name: `name_${itemCount}`,
      description: `[description ${itemCount}]`,
      details: `details ${itemCount}`,
      workspaceItemType,
      workspace: null
    },
    diagram: null,
    parent: null,
    relationships: [],
    data: {
      position,
      color: null
    },
    children: []
  }

  return diagramItemDTO
}

export const generateRelationship = (item1: DiagramItem, item2: DiagramItem): void => {
  item1.relationships = [{
    diagramItem: item2,
    description: 'Interacts with mobile app',
    details: '',
    data: {
      fromPosition: {
        x: 10,
        y: 10,
        width: 0,
        height: 0
      },
      toPosition: {
        x: 10,
        y: 10,
        width: 0,
        height: 0
      }
    },
    diagramType: 'C4'
  }]
}

export const generateDiagramItemsAndRelationthip = (): DiagramItem[] => {
  const item1 = generateDiagramItem(true)
  const item2 = generateDiagramItem(true, WorkspaceItemType.MOBILE_CONTAINER)
  const item3 = generateDiagramItem(true, WorkspaceItemType.CONTAINER)

  generateRelationship(item1, item2)
  generateRelationship(item2, item3)

  return [item1, item2, item3]
}
