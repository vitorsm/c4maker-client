import { generateComponentComponent, generateContainer, generateDatabaseContainer, generateMobileContainer, generateRelationshipComponent, generateUserComponent, generateWebContainer } from '../component_utils'
import { Position } from '../../canvas-container/models'
import * as textUtils from '../../canvas-container/text-utils'
import { DiagramItemRelationship } from '../../../models/diagram'

/***
 * I didn't find a good way to test canvas. These tests are not good enough because they only assert if the canvas was called with the expected params.
 * A better test would be check if the components were correctly draw.
 */

jest.mock('../../canvas-container/text-utils')

let canvasContext: CanvasRenderingContext2D

beforeEach(() => {
  canvasContext = {
    beginPath: jest.fn(),
    arc: jest.fn(),
    closePath: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    fillText: jest.fn(),
    rect: jest.fn(),
    ellipse: jest.fn(),
    stroke: jest.fn(),
    setLineDash: jest.fn()
  }
})

const assertRoundRect = (x: number, y: number, width: number, height: number, radius: number): void => {
  const endX = x + width
  const endY = y + height

  expect(canvasContext.moveTo).toBeCalledWith(x + radius, y)
  expect(canvasContext.lineTo).toBeCalledWith(endX - radius, y)
  expect(canvasContext.lineTo).toBeCalledWith(endX, endY - radius)
  expect(canvasContext.lineTo).toBeCalledWith(x + radius, endY)
  expect(canvasContext.lineTo).toBeCalledWith(x, y + radius)
  expect(canvasContext.fill).toBeCalled()
}

test('test generate user component', () => {
  // given
  const texts = ['text1', 'text2']
  const writeFunctionMock = textUtils.writeTextsAndAdjustPosition as jest.Mock

  const position: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }

  // when
  generateUserComponent(canvasContext, position, texts)

  // then
  const expectedCirclePositionX = 60 // x + width/2
  const expectedCirclePositionY = 33 // y + radius
  const expectedCircleRadius = 23 // 23% of 100
  const expectedBoxPositionX = 10
  const expecetedBoxPositionY = 0.8 * 46 + 10 // %80 of 2 * radius + position y
  const expectedBoxWidth = 100
  const expectedBoxHeight = 63.2 // height - position y

  const [, writeTextFuncTexts, textBoxPosition, , ,] = writeFunctionMock.mock.calls[0]

  expect(canvasContext.beginPath).toBeCalled()
  expect(canvasContext.closePath).toBeCalled()
  expect(canvasContext.arc).toBeCalledTimes(1)
  expect(canvasContext.arc).toBeCalledWith(expectedCirclePositionX, expectedCirclePositionY, expectedCircleRadius, 0, 2 * Math.PI)
  expect(writeFunctionMock).toBeCalled()
  expect(writeTextFuncTexts).toEqual(texts)
  expect(textBoxPosition.x).toEqual(expectedBoxPositionX)
  expect(textBoxPosition.y).toEqual(expecetedBoxPositionY)
  expect(textBoxPosition.width).toEqual(expectedBoxWidth)
  expect(textBoxPosition.height).toBeCloseTo(expectedBoxHeight) // close because it is a float number
  assertRoundRect(expectedBoxPositionX, expecetedBoxPositionY, expectedBoxWidth, expectedBoxHeight, 50)
})

test('test generate component', () => {
  // given
  const texts = ['text1', 'text2']
  const position: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const writeFunctionMock = textUtils.writeTextsAndAdjustPosition as jest.Mock

  // when
  generateComponentComponent(canvasContext, position, texts)

  // then
  const [, writeTextFuncTexts, textBoxPosition, , , ,color] = writeFunctionMock.mock.calls[0]

  expect(writeFunctionMock).toBeCalled()
  assertRoundRect(position.x, position.y, position.width, position.height, 10)
  expect(writeTextFuncTexts).toEqual(texts)
  expect(textBoxPosition).toEqual(position)
  expect(color).toEqual('black')
})

test('test generate container', () => {
  // given
  const texts = ['text1', 'text2']
  const position: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const writeFunctionMock = textUtils.writeTextsAndAdjustPosition as jest.Mock

  // when
  generateContainer(canvasContext, position, texts)

  // then
  const [, writeTextFuncTexts, textBoxPosition, , , ,color] = writeFunctionMock.mock.calls[0]

  expect(writeFunctionMock).toBeCalled()
  assertRoundRect(position.x, position.y, position.width, position.height, 10)
  expect(writeTextFuncTexts).toEqual(texts)
  expect(textBoxPosition).toEqual(position)
  expect(color).toBeUndefined()
})

test('test generate web container', () => {
  // given
  const texts = ['text1']
  const secondaryColor = 'secondaryColor'
  const position: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const writeFunctionMock = textUtils.writeTextsAndAdjustPosition as jest.Mock

  // when
  generateWebContainer(canvasContext, position, texts, secondaryColor)

  // then
  const [, writeTextFuncTexts, textBoxPosition, , , ,color] = writeFunctionMock.mock.calls[0]

  assertRoundRect(position.x, position.y, position.width, position.height, 10)
  expect(writeFunctionMock).toBeCalled()
  expect(writeTextFuncTexts).toEqual(texts)
  expect(textBoxPosition).toEqual(position)
  expect(color).toBeUndefined()
})

test('test generate mobile container', () => {
  // given
  const texts = ['text1', 'text2']
  const secondaryColor = 'secondaryColor'
  const position: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const writeFunctionMock = textUtils.writeTextsAndAdjustPosition as jest.Mock

  // when
  generateMobileContainer(canvasContext, position, texts, secondaryColor)

  // then
  const [, writeTextFuncTexts, textBoxPosition, , , ,color] = writeFunctionMock.mock.calls[0]

  assertRoundRect(position.x, position.y, position.width, position.height, 10)
  expect(writeFunctionMock).toBeCalled()
  expect(writeTextFuncTexts).toEqual(texts)
  expect(textBoxPosition).toEqual(position)
  expect(color).toBeUndefined()
  expect(canvasContext.rect).toBeCalled()
})

test('test generate db container', () => {
  // given
  const texts = ['text1', 'text2']
  const position: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const writeFunctionMock = textUtils.writeTextsAndAdjustPosition as jest.Mock

  // when
  generateDatabaseContainer(canvasContext, position, texts)

  // then
  const expectedSemicirleRadius = 100 / 6
  const expectedRectanglePosition: Position = {
    x: position.x,
    y: 10 + expectedSemicirleRadius - 10, // position.y + semicircleRadiusY - diffBetweenRectangleAndSemicircle
    width: position.width,
    height: position.height - expectedSemicirleRadius * 2 + 20
  }
  const [, writeTextFuncTexts, textBoxPosition, , , ,color] = writeFunctionMock.mock.calls[0]

  expect(writeFunctionMock).toBeCalled()
  assertRoundRect(expectedRectanglePosition.x, expectedRectanglePosition.y, expectedRectanglePosition.width, expectedRectanglePosition.height, 10)
  expect(writeTextFuncTexts).toEqual(texts)
  expect(textBoxPosition).toEqual(position)
  expect(color).toBeUndefined()
})

test('test generate relationship component destination left', () => {
  // given
  const firstItemPosition: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const secondItemPosition: Position = {
    x: 200,
    y: 10,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 200,
    y: 50,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  expect(canvasContext.moveTo).toBeCalledWith(110, 60)
  expect(canvasContext.lineTo).toBeCalledWith(secondItemRelationshipPosition.x, 60)
})

test('test generate relationship component without point x', () => {
  // given
  const firstItemPosition: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const secondItemPosition: Position = {
    x: 200,
    y: 10,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 400,
    y: 50,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  expect(canvasContext.moveTo).toBeCalledWith(110, 60)
  expect(canvasContext.lineTo).toBeCalledWith(secondItemPosition.x, 60)
})

test('test generate relationship component without point y', () => {
  // given
  const firstItemPosition: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const secondItemPosition: Position = {
    x: 200,
    y: 10,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 200,
    y: 200,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  const [fromPositionX, fromPositionY] = canvasContext.moveTo.mock.calls[0]
  const [toPositionX, toPositionY] = canvasContext.lineTo.mock.calls[0]

  expect(fromPositionX).toEqual(110)
  expect(fromPositionY).toBeCloseTo(70.4, 1)
  expect(toPositionX).toEqual(200)
  expect(toPositionY).toBeCloseTo(89.2, 1)
})

test('test generate relationship component destination top', () => {
  // given
  const firstItemPosition: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 100,
    y: 0,
    width: 0,
    height: 0
  }
  const secondItemPosition: Position = {
    x: 200,
    y: 150,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 90,
    y: 10,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  const [fromPositionX, fromPositionY] = canvasContext.moveTo.mock.calls[0]
  const [toPositionX, toPositionY] = canvasContext.lineTo.mock.calls[0]

  expect(fromPositionX).toEqual(110)
  expect(fromPositionY).toBeCloseTo(10)
  expect(toPositionX).toBeCloseTo(278, 1)
  expect(toPositionY).toBeCloseTo(150)
})

test('test generate relationship component destination bottom', () => {
  // given
  const firstItemPosition: Position = {
    x: 10,
    y: 300,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const secondItemPosition: Position = {
    x: 500,
    y: 10,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 80,
    y: 80,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  const [fromPositionX, fromPositionY] = canvasContext.moveTo.mock.calls[0]
  const [toPositionX, toPositionY] = canvasContext.lineTo.mock.calls[0]

  expect(fromPositionX).toBeCloseTo(110)
  expect(fromPositionY).toBeCloseTo(325)
  expect(toPositionX).toBeCloseTo(540)
  expect(toPositionY).toBeCloseTo(110)
})

test('test generate relationship component destination right', () => {
  // given
  const secondItemPosition: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const firstItemPosition: Position = {
    x: 200,
    y: 10,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  expect(canvasContext.moveTo).toBeCalledWith(200, 60)
  expect(canvasContext.lineTo).toBeCalledWith(110, 60)
})

test('test generate relationship component when points are out of components', () => {
  // given
  const firstItemPosition: Position = {
    x: 10,
    y: 10,
    width: 100,
    height: 100
  }
  const firstItemRelationshipPosition: Position = {
    x: 50,
    y: 50,
    width: 0,
    height: 0
  }
  const secondItemPosition: Position = {
    x: 200,
    y: 10,
    width: 100,
    height: 100
  }
  const secondItemRelationshipPosition: Position = {
    x: 200,
    y: 50,
    width: 0,
    height: 0
  }
  const texts = ['text1']
  const relationship: DiagramItemRelationship = {
    data: {
      fromPosition: firstItemRelationshipPosition,
      toPosition: secondItemRelationshipPosition
    },
    diagramItem: undefined,
    description: '',
    details: '',
    diagramType: ''
  }

  // when
  generateRelationshipComponent(canvasContext, texts, relationship, firstItemPosition, secondItemPosition)

  // then
  expect(canvasContext.moveTo).toBeCalledWith(110, 60)
  expect(canvasContext.lineTo).toBeCalledWith(secondItemRelationshipPosition.x, 60)
})
