import { RefObject } from 'react'
import { DrawableItem, Position } from './canvas-container'

export const extractEventPosition = (event: any, componentRef: RefObject<HTMLElement>): Position => {
  const containerComponent = componentRef.current

  if (containerComponent === null) return { x: 0, y: 0, width: 0, height: 0 }

  const startComponentX = event.target.offsetLeft
  const startComponentY = event.target.offsetTop

  const startScrollX = containerComponent.scrollLeft
  const startScrollY = containerComponent.scrollTop

  const clickX = event.clientX - startComponentX + startScrollX
  const clickY = event.clientY - startComponentY + startScrollY

  return { x: clickX, y: clickY, width: 0, height: 0 }
}

export const isPositionInItem = (drawItem: DrawableItem, position: Position): boolean => {
  const itemPosition = drawItem.position
  const endX = itemPosition.x + itemPosition.width
  const endY = itemPosition.y + itemPosition.height

  if (position.x < itemPosition.x || position.y < itemPosition.y) {
    return false
  }

  if (position.x > endX || position.y > endY) {
    return false
  }

  return true
}

export const getClickedItem = (position: Position, items: DrawableItem[]): DrawableItem | null => {
  const selectedItem = items.filter(item => isPositionInItem(item, position))
  return selectedItem.length === 0 ? null : selectedItem[selectedItem.length - 1]
}

export const handleSelectItem = (position: Position, items: DrawableItem[]): DrawableItem[] | null => {
  const selectedItem = getClickedItem(position, items)
  const anySelected = items.some(item => item.isSelected)

  items.forEach(item => {
    item.isSelected = false
  })

  let shouldReRender = false

  if (selectedItem !== null) {
    selectedItem.isSelected = true
    shouldReRender = true
  } else {
    shouldReRender = anySelected
  }

  return shouldReRender ? items : null
}

export const roundRect = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number = 10): void => {
  const endX = x + width
  const endY = y + height

  context.moveTo(x + radius, y)
  context.lineTo(endX - radius, y)
  context.quadraticCurveTo(endX, y, endX, y + radius)
  context.lineTo(endX, endY - radius)
  context.quadraticCurveTo(endX, endY, endX - radius, endY)
  context.lineTo(x + radius, endY)
  context.quadraticCurveTo(x, endY, x, endY - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)

  context.fill()
}
