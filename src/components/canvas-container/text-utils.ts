import { Position } from './models'

const TITLE_FONT_SIZE = 18
const BODY_FONT_SIZE = 14
const FONT_COLOR = '#FFFFFF'

const writeText = (context: CanvasRenderingContext2D, text: string, position: Position, fontSize: number,
  dryExecution: boolean = false): number => {
  context.fillStyle = FONT_COLOR
  context.font = `${fontSize}px serif`
  const distanceBetweenLines = 2

  const textsToWrite = []
  let tempText = ''
  for (let textIndex = 0; textIndex < text.length; textIndex++) {
    if (context.measureText(tempText).width < position.width) {
      tempText += text[textIndex]
    } else {
      textsToWrite.push(tempText)
      tempText = text[textIndex]
    }
  }

  if (tempText !== '') {
    textsToWrite.push(tempText)
  }

  let yPosition = position.y + distanceBetweenLines + fontSize
  let shouldContinue = false
  textsToWrite.forEach((t, index) => {
    if (shouldContinue) {
      return null
    }

    const isLastText = index === textsToWrite.length - 1
    const isFull = yPosition - position.y + fontSize > position.height && !isLastText
    const textToWrite = isFull ? t.substring(0, t.length - 1) + '...' : t

    const textWidth = context.measureText(textToWrite).width
    const diffX = position.width / 2 - textWidth / 2

    if (!dryExecution) {
      context.fillText(textToWrite, position.x + diffX, yPosition, position.width)
    }

    yPosition += distanceBetweenLines + fontSize
    shouldContinue = isFull
  })

  return yPosition - distanceBetweenLines - fontSize
}

const writeTextsInBox = (context: CanvasRenderingContext2D, texts: string[], fontSizes: number[],
  textPosition: Position, topPadding: number, boxPosition: Position, dryExecution: boolean, remainingY: number): number => {
  if (texts.length === 0) {
    return boxPosition.y
  }

  const startPositionY = textPosition.y
  const distanceBetweenText = (remainingY / texts.length - 1) * 0.8

  let yPosition = 0

  texts.forEach((text, index) => {
    const isLast = index === texts.length - 1
    if (isLast) {
      textPosition.height = boxPosition.height - (textPosition.y - boxPosition.y)
    }

    yPosition = writeText(context, text, textPosition, fontSizes[index], dryExecution)
    textPosition.y = yPosition + topPadding + distanceBetweenText
  })

  return yPosition - startPositionY
}

export const writeTextsAndAdjustPosition = (context: CanvasRenderingContext2D, texts: string[], boxPosition: Position, topPadding: number, leftPadding: number, borderRadius: number): void => {
  if (texts.length === 0) {
    return
  }

  const startY = boxPosition.y + topPadding
  const maxHeightTitle = boxPosition.height * 0.4

  const textPosition = {
    x: boxPosition.x + borderRadius / 2 + leftPadding,
    y: startY,
    width: boxPosition.width - borderRadius - leftPadding * 2,
    height: maxHeightTitle
  }

  const fontSizes = texts.map((_, index) => {
    return index > 0 ? BODY_FONT_SIZE : TITLE_FONT_SIZE
  })

  const textHeight = writeTextsInBox(context, texts, fontSizes, { ...textPosition }, topPadding, boxPosition, true, 0) + topPadding * 2
  const diffY = boxPosition.height - textHeight
  writeTextsInBox(context, texts, fontSizes, { ...textPosition }, topPadding, boxPosition, false, diffY)
}
