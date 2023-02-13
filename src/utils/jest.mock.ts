import { DrawableItem, DrawType, Position } from '../components/canvas-container/models'
import { DiagramItem, DiagramItemType } from '../models/diagram'

const ITEM_IDS = { drawableItemCount: 0, diagramItemCount: 0 }

export const generateDrawableItem = (position: Position, drawFunction: Function, itemType: DrawType = DrawType.IMG): DrawableItem => {
  const itemCount = ITEM_IDS.drawableItemCount++

  return {
    id: `id_${itemCount}`,
    type: itemType,
    img: null,
    position,
    isSelected: false,
    drawItem: drawFunction,
    name: `name_${itemCount}`,
    details: `details_${itemCount}`,
    description: `description_${itemCount}`,
    color: '#000000'
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

export const generateDiagramItem = (): DiagramItem => {
  const itemCount = ITEM_IDS.diagramItemCount++

  return {
    id: `id_${itemCount}`,
    key: `id_${itemCount}`,
    name: `name_${itemCount}`,
    itemDescription: `[description ${itemCount}]`,
    details: `details ${itemCount}`,
    itemType: DiagramItemType.PERSON,
    diagram: null,
    parent: null,
    relationships: [],
    canvasData: {
      position: null,
      color: null
    }
  }
}
