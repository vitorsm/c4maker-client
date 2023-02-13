import { DiagramItemRelationship } from '../../models/diagram'
import { Position } from '../canvas-container/models'
import { writeTextsAndAdjustPosition } from '../canvas-container/text-utils'
import { drawLineFromPositionToPosition, roundRect } from '../canvas-container/utils'
import { getInterceptionPoint } from './utils'

export const generateUserComponent = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
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

export const generateContainerComponent = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
  const topPadding = 10
  const leftPadding = 2
  const borderRadius = 10

  context.beginPath()
  roundRect(context, position.x, position.y, position.width, position.height, borderRadius)
  context.closePath()

  writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius)
}

export const generateRelationshipComponent = (context: CanvasRenderingContext2D, texts: string[],
  relationship: DiagramItemRelationship, sourceItemPosition: Position, targetItemPosition: Position): void => {
  const fromPosition = generatePositionFromItemPositionAndPosition(sourceItemPosition, relationship.fromPosition, targetItemPosition, relationship.toPosition)
  const toPosition = generatePositionFromItemPositionAndPosition(targetItemPosition, relationship.toPosition, sourceItemPosition, relationship.fromPosition)

  drawLineFromPositionToPosition(context, fromPosition, toPosition)
}

const generatePositionFromItemPositionAndPosition = (itemPosition: Position, relationshipPosition: Position,
  anotherItemPosition: Position, anotherRelationhipPotision: Position): Position => {
  const fromPosition = {
    x: relationshipPosition.x + itemPosition.x,
    y: relationshipPosition.y + itemPosition.y,
    width: 0,
    height: 0
  }

  const toPosition = {
    x: anotherRelationhipPotision.x + anotherItemPosition.x,
    y: anotherRelationhipPotision.y + anotherItemPosition.y,
    width: 0,
    height: 0
  }

  const topLeft = { ...itemPosition }
  const topRight = {
    x: itemPosition.x + itemPosition.width,
    y: itemPosition.y,
    width: 0,
    height: 0
  }
  const bottomLeft = {
    x: itemPosition.x,
    y: itemPosition.y + itemPosition.height,
    width: 0,
    height: 0
  }
  const bottomRight = {
    x: itemPosition.x + itemPosition.width,
    y: itemPosition.y + itemPosition.height,
    width: 0,
    height: 0
  }

  let point = getInterceptionPoint([topLeft, topRight], [fromPosition, toPosition])

  if (point !== null) {
    return point
  }
  point = getInterceptionPoint([topLeft, bottomLeft], [fromPosition, toPosition])
  if (point !== null) {
    return point
  }
  point = getInterceptionPoint([bottomLeft, bottomRight], [fromPosition, toPosition])
  if (point !== null) {
    return point
  }
  point = getInterceptionPoint([bottomRight, topRight], [fromPosition, toPosition])
  if (point !== null) {
    return point
  }

  // todo evaluate if it makes sense

  const endX = itemPosition.x + itemPosition.width
  const endY = itemPosition.y + itemPosition.height

  const isCloserEndX = Math.abs(fromPosition.x - endX) < Math.abs(fromPosition.x - itemPosition.x)
  const isCloserEndY = Math.abs(fromPosition.y - endY) < Math.abs(fromPosition.y - itemPosition.y)
  const diffX = isCloserEndX ? fromPosition.x - endX : fromPosition.x - itemPosition.x
  const diffY = isCloserEndY ? fromPosition.y - endY : fromPosition.y - itemPosition.y

  const isXCloserThanY = diffX < diffY
  const xPosition = isXCloserThanY ? isCloserEndX ? endX : itemPosition.x : fromPosition.x
  const yPosition = isXCloserThanY ? fromPosition.y : isCloserEndY ? endY : itemPosition.y

  const newPosition = {
    x: xPosition,
    y: yPosition,
    width: 0,
    height: 0
  }

  return newPosition
}
