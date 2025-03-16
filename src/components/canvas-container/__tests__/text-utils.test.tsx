import { generatePosition } from '../../../utils/jest.mock'
import { writeTextsAndAdjustPosition } from '../text-utils'

test('test write text', async () => {
  const sizePerCharacter = 3
  const titleFontSize = 18
  const distanceBetweenLines = 2
  const leftPadding = 2
  const topPadding = 2
  const borderRadius = 1
  const boxPosition = generatePosition(10, 10, 25, 100)
  const textPosition = {
    x: boxPosition.x + borderRadius / 2 + leftPadding,
    y: boxPosition.y + topPadding,
    width: boxPosition.width - borderRadius - leftPadding * 2,
    height: boxPosition.height * 0.4
  }

  const canvasContext: any = {
    measureText: (text: string): any => ({
      width: text.length * sizePerCharacter
    }),
    fillStyle: '',
    font: '',
    fillText: (text: string, positionX: number, positionY: number, width: number) => {

    }
  }

  jest.spyOn(canvasContext, 'fillText')

  const textsToWrite = ['123456789 123456789', '123456789 123456789']

  writeTextsAndAdjustPosition(canvasContext, textsToWrite, boxPosition, topPadding, 2, 1)

  const textPart1 = '1234567'
  let diffX = textPosition.width / 2 - textPart1.length * sizePerCharacter / 2
  let yPosition = textPosition.y + distanceBetweenLines + titleFontSize
  expect(canvasContext.fillText).toBeCalledWith(textPart1, textPosition.x + diffX, yPosition, textPosition.width)

  const textPart2 = '89 123...'
  yPosition += distanceBetweenLines + titleFontSize
  diffX = textPosition.width / 2 - textPart2.length * sizePerCharacter / 2
  expect(canvasContext.fillText).toBeCalledWith(textPart2, textPosition.x + diffX, yPosition, textPosition.width)
})

export {}
