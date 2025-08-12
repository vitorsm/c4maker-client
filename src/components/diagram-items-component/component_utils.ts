import { DiagramItemRelationship } from '../../models/diagram'
import { Position } from '../canvas-container/models'
import { writeTextsAndAdjustPosition } from '../canvas-container/text-utils'
import { drawLineFromPositionToPosition, roundRect } from '../canvas-container/utils'
import { getInterceptionPoint } from './utils'

const drawItemInsidePath = (context: CanvasRenderingContext2D, internalFunc: () => void, color?: string): void => {
  context.beginPath()
  if (color != null) {
    context.fillStyle = color
  }
  internalFunc()
  context.closePath()
  context.fill()
}

export const generateUserComponent = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
  const circleRadius = position.height * 0.23
  const circleX = position.x + position.width / 2
  const startBoxY = 0.8 * circleRadius * 2
  const boxHeight = position.height - circleRadius * 2 * 0.8
  const borderRadius = 50
  const topPadding = 10
  const leftPadding = 2

  const boxPosition = { x: position.x, y: position.y + startBoxY, width: position.width, height: boxHeight }

  drawItemInsidePath(context, () => {
    context.arc(circleX, position.y + circleRadius, circleRadius, 0, 2 * Math.PI)
    roundRect(context, boxPosition, borderRadius)
  })

  writeTextsAndAdjustPosition(context, texts, boxPosition, topPadding, leftPadding, borderRadius)
}

export const generateComponentComponent = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
  const topPadding = 10
  const leftPadding = 2
  const borderRadius = 10

  drawItemInsidePath(context, () => roundRect(context, position, borderRadius))

  writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius, 'black')
}

export const generateContainer = (context: CanvasRenderingContext2D, position: Position, texts: string[], isOpened: boolean): void => {
  const topPadding = 10
  const leftPadding = 2
  const borderRadius = 10

  context.beginPath()
  roundRect(context, position, borderRadius)
  context.closePath()

  writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius)
}

export const generateWebContainer = (context: CanvasRenderingContext2D, position: Position, texts: string[], secondaryColor: string): void => {
  const topPadding = 20
  const leftPadding = 2
  const borderRadius = 10

  const internalRectangleMarginX = 5

  const addressAreaHeight = position.height * 0.13

  const circleRadius = position.height / 2 * 0.07
  const circleStartPositionX = position.x + internalRectangleMarginX + circleRadius
  const criclePositionY = position.y + internalRectangleMarginX + circleRadius
  const circleXDistance = circleRadius * 2 + 5

  const internalRectanglePositionX = position.x + internalRectangleMarginX
  const internalRectanglePositionY = position.y + addressAreaHeight
  const internalRectangleWidth = position.width - 2 * internalRectangleMarginX
  const internalRectangleHeight = position.height - addressAreaHeight - internalRectangleMarginX

  const addressRectangleDistanceStartX = 2 * internalRectangleMarginX + 2 * circleXDistance + 3 * circleRadius
  const addressRectanglePositionX = position.x + addressRectangleDistanceStartX
  const addressRectanglePositionY = position.y + internalRectangleMarginX
  const addressRectangleWidth = position.width - addressRectangleDistanceStartX - internalRectangleMarginX
  const addressRectangleHeight = circleRadius * 2

  const internalRectanglePosition: Position = {
    x: internalRectanglePositionX,
    y: internalRectanglePositionY,
    width: internalRectangleWidth,
    height: internalRectangleHeight
  }

  const addressRectanglePosition: Position = {
    x: addressRectanglePositionX,
    y: addressRectanglePositionY,
    width: addressRectangleWidth,
    height: addressRectangleHeight
  }

  drawItemInsidePath(context, () => roundRect(context, position, borderRadius))
  drawItemInsidePath(context, () => roundRect(context, internalRectanglePosition, borderRadius), secondaryColor)
  drawItemInsidePath(context, () => context.arc(circleStartPositionX, criclePositionY, circleRadius, 0, 2 * Math.PI), secondaryColor)
  drawItemInsidePath(context, () => context.arc(circleStartPositionX + circleXDistance, criclePositionY, circleRadius, 0, 2 * Math.PI), secondaryColor)
  drawItemInsidePath(context, () => context.arc(circleStartPositionX + 2 * circleXDistance, criclePositionY, circleRadius, 0, 2 * Math.PI), secondaryColor)
  drawItemInsidePath(context, () => roundRect(context, addressRectanglePosition, borderRadius), secondaryColor)

  writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius)
}

export const generateMobileContainer = (context: CanvasRenderingContext2D, position: Position, texts: string[], secondaryColor: string): void => {
  const topPadding = 10
  const leftPadding = 2
  const borderRadius = 10

  const circlePadding = 3
  const circleRadius = position.height / 2 * 0.07
  const distanceToStartCircle = circleRadius + circlePadding
  const circlePositionX = position.x + distanceToStartCircle
  const circlePositionY = position.y + position.height / 2

  const distanceToStartInternalRectangle = 2 * distanceToStartCircle
  const internalRectanglePositionX = position.x + distanceToStartInternalRectangle
  const internalRectangleMarginY = 7
  const internalRectanglePositionY = position.y + internalRectangleMarginY
  const internalRectangleWidth = position.width - distanceToStartInternalRectangle * 2
  const internalRectanbleHeight = position.height - internalRectangleMarginY * 2

  const recAudioWidth = 3
  const recAudioHeight = position.height * 0.2
  const widthAfterInternalRectangle = (position.x + position.width) - (internalRectanglePositionX + internalRectangleWidth)
  const recAudioPositionX = internalRectanglePositionX + internalRectangleWidth + (widthAfterInternalRectangle / 2 - recAudioWidth / 2)
  const recAudioPositionY = position.y + (position.height / 2 - recAudioHeight / 2)

  const internalRectanglePosition: Position = {
    x: internalRectanglePositionX,
    y: internalRectanglePositionY,
    width: internalRectangleWidth,
    height: internalRectanbleHeight
  }

  drawItemInsidePath(context, () => roundRect(context, position, borderRadius))

  drawItemInsidePath(context, () => {
    roundRect(context, internalRectanglePosition, borderRadius)
    context.rect(recAudioPositionX, recAudioPositionY, recAudioWidth, recAudioHeight)
    context.arc(circlePositionX, circlePositionY, circleRadius, 0, 2 * Math.PI)
  }, secondaryColor)

  writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius)
}

export const generateDatabaseContainer = (context: CanvasRenderingContext2D, position: Position, texts: string[]): void => {
  const topPadding = 10
  const leftPadding = 2
  const borderRadius = 10

  const diffBetweenRectangleAndSemicircle = 10 // this constant is important to remove a tiny empty space between the rectangle and semicircle

  const semicircleRadiusX = position.width / 2
  const semicircleRadiusY = position.height / 6

  const rectanglePositionX = position.x
  const rectanglePositionY = position.y + semicircleRadiusY - diffBetweenRectangleAndSemicircle
  const rectangleHeigh = position.height - semicircleRadiusY * 2 + diffBetweenRectangleAndSemicircle * 2

  const topSemicirclePositionX = position.x + position.width / 2
  const topSemicirclePositionY = rectanglePositionY + diffBetweenRectangleAndSemicircle

  const bottomSemicirclePositionX = topSemicirclePositionX
  const bottomSemicirclePositionY = rectanglePositionY + rectangleHeigh - diffBetweenRectangleAndSemicircle

  const rectanglePosition: Position = {
    x: rectanglePositionX,
    y: rectanglePositionY,
    width: position.width,
    height: rectangleHeigh
  }

  drawItemInsidePath(context, () => {
    context.ellipse(topSemicirclePositionX, topSemicirclePositionY, semicircleRadiusX, semicircleRadiusY, 0, 0, Math.PI * 2)
    context.ellipse(bottomSemicirclePositionX, bottomSemicirclePositionY, semicircleRadiusX, semicircleRadiusY, 0, 0, Math.PI * 2)
    roundRect(context, rectanglePosition, borderRadius)
  })

  writeTextsAndAdjustPosition(context, texts, position, topPadding, leftPadding, borderRadius)
}

export const generateRelationshipComponent = (context: CanvasRenderingContext2D, texts: string[],
  relationship: DiagramItemRelationship, sourceItemPosition: Position, targetItemPosition: Position): void => {
  const relationshipFromPosition = relationship.data.fromPosition
  const relationshipToPosition = relationship.data.toPosition

  const fromPosition = generatePositionFromItemPositionAndPosition(sourceItemPosition, relationshipFromPosition, targetItemPosition, relationshipToPosition)
  const toPosition = generatePositionFromItemPositionAndPosition(targetItemPosition, relationshipToPosition, sourceItemPosition, relationshipFromPosition)
  drawLineFromPositionToPosition(context, fromPosition, toPosition)
}

const generatePositionFromItemPositionAndPosition = (itemPosition: Position, relationshipPosition: Position,
  anotherItemPosition: Position, anotherRelationhipPotision: Position): Position | null => {
  const fromPosition = {
    x: Math.min(relationshipPosition.x + itemPosition.x, itemPosition.x + itemPosition.width),
    y: Math.min(relationshipPosition.y + itemPosition.y, itemPosition.y + itemPosition.width),
    width: 0,
    height: 0
  }

  const toPosition = {
    x: Math.min(anotherRelationhipPotision.x + anotherItemPosition.x, anotherItemPosition.x + anotherItemPosition.width),
    y: Math.min(anotherRelationhipPotision.y + anotherItemPosition.y, anotherItemPosition.y + anotherItemPosition.height),
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
  return point

  // // todo evaluate if it makes sense: As we ensure all points will be inside of the component, it always possible to find the intercept points

  // const endX = itemPosition.x + itemPosition.width
  // const endY = itemPosition.y + itemPosition.height

  // const isCloserEndX = Math.abs(fromPosition.x - endX) < Math.abs(fromPosition.x - itemPosition.x)
  // const isCloserEndY = Math.abs(fromPosition.y - endY) < Math.abs(fromPosition.y - itemPosition.y)
  // const diffX = isCloserEndX ? fromPosition.x - endX : fromPosition.x - itemPosition.x
  // const diffY = isCloserEndY ? fromPosition.y - endY : fromPosition.y - itemPosition.y

  // const isXCloserThanY = diffX < diffY
  // const xPosition = isXCloserThanY ? isCloserEndX ? endX : itemPosition.x : fromPosition.x
  // const yPosition = isXCloserThanY ? fromPosition.y : isCloserEndY ? endY : itemPosition.y

  // const newPosition = {
  //   x: xPosition,
  //   y: yPosition,
  //   width: 0,
  //   height: 0
  // }

  // return newPosition
}
