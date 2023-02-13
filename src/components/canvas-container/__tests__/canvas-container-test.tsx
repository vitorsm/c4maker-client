import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import CanvasContainer from '../canvas-container'
import { generateDrawableItem, generatePosition, generateScrollComponentRef } from '../../../utils/jest.mock'

test('test render canvas components', async () => {
  const drawFunction = jest.fn()
  const position = generatePosition(100, 100, 100, 100)
  const item1 = generateDrawableItem(position, drawFunction)
  const item2 = generateDrawableItem(position, drawFunction)
  const item3 = generateDrawableItem(position, drawFunction)

  const drawableItems = [item1, item2, item3]

  const mockParentComponentRef: any = generateScrollComponentRef(0, 0)

  render(
    <CanvasContainer
      drawableItems={drawableItems}
      canvasWidth={1000}
      canvasHeight={500}
      parentComponentRef={mockParentComponentRef}
      onItemPositionChange={() => {}}
      onItemSelectionChange={() => {}}
      onLink={() => {}}
      drawLineToMouse={false} />
  )

  expect(drawFunction).toBeCalledTimes(3)
})

test('test select item by click', async () => {
  const itemPosition1 = generatePosition(100, 100, 100, 100)
  const itemPosition2 = generatePosition(202, 100, 100, 100)

  const drawFunction = jest.fn()
  const onItemSelectionChangeFunction = jest.fn()

  const item1 = generateDrawableItem(itemPosition1, drawFunction)
  const item2 = generateDrawableItem(itemPosition2, drawFunction)

  const drawableItems = [item1, item2]

  const mockParentComponentRef = generateScrollComponentRef(50, 50)

  render(
    <CanvasContainer
      drawableItems={drawableItems}
      canvasWidth={1000}
      canvasHeight={500}
      parentComponentRef={mockParentComponentRef}
      onItemPositionChange={() => {}}
      onItemSelectionChange={onItemSelectionChangeFunction}
      onLink={() => {}}
      drawLineToMouse={false} />
  )

  const newItems = [{ ...item1 }, { ...item2 }]

  const canvasComponent = screen.getByTestId('canvas-component-test-id')

  // first click in the first item
  const clickPosition = { clientX: 51, clientY: 120 }
  await fireEvent.mouseDown(canvasComponent, clickPosition)
  await fireEvent.mouseUp(canvasComponent)

  newItems[0].isSelected = true
  newItems[1].isSelected = false

  expect(onItemSelectionChangeFunction).toBeCalledWith(newItems)

  // second click in no item
  clickPosition.clientX = 151
  await fireEvent.mouseDown(canvasComponent, clickPosition)
  await fireEvent.mouseUp(canvasComponent)

  newItems[0].isSelected = false
  newItems[1].isSelected = false

  expect(onItemSelectionChangeFunction).toBeCalledWith(newItems)

  // third click in the second item
  clickPosition.clientX = 153
  await fireEvent.mouseDown(canvasComponent, clickPosition)
  await fireEvent.mouseUp(canvasComponent)

  newItems[0].isSelected = false
  newItems[1].isSelected = true

  expect(onItemSelectionChangeFunction).toBeCalledWith(newItems)
})

test('test move component', async () => {
  const drawFunction = jest.fn()
  const itemPositionChangeFunction = jest.fn()
  const itemPosition = generatePosition(100, 100, 100, 100)
  const item1 = generateDrawableItem(itemPosition, drawFunction)
  const drawableItems = [item1]

  const mockParentComponentRef = generateScrollComponentRef(120, 40)

  render(
    <CanvasContainer
      drawableItems={drawableItems}
      canvasWidth={1000}
      canvasHeight={500}
      parentComponentRef={mockParentComponentRef}
      onItemPositionChange={itemPositionChangeFunction}
      onItemSelectionChange={() => {}}
      onLink={() => {}}
      drawLineToMouse={false} />
  )

  const distanceXToMove = 100
  const distanceYToMove = 50

  const clickPosition = { clientX: 1, clientY: 61 }
  const upPosition = { clientX: clickPosition.clientX + distanceXToMove, clientY: clickPosition.clientY + distanceYToMove }

  const canvasComponent = screen.getByTestId('canvas-component-test-id')
  await fireEvent.mouseDown(canvasComponent, clickPosition)
  await fireEvent.mouseMove(canvasComponent, upPosition)
  await fireEvent.mouseUp(canvasComponent)

  const newPosition = {
    ...itemPosition,
    x: itemPosition.x + distanceXToMove,
    y: itemPosition.y + distanceYToMove
  }

  expect(drawFunction).toBeCalledTimes(1)
  expect(itemPositionChangeFunction).toBeCalledWith(drawableItems[0], newPosition)
})

test('test link components', async () => {
  const itemPosition1 = generatePosition(100, 100, 100, 100)
  const itemPosition2 = generatePosition(202, 100, 100, 100)

  const drawFunction = jest.fn()
  const onLinkFunction = jest.fn()

  const item1 = generateDrawableItem(itemPosition1, drawFunction)
  const item2 = generateDrawableItem(itemPosition2, drawFunction)

  const drawableItems = [item1, item2]
  const scrollX = 50
  const scrollY = 50
  const mockParentComponentRef = generateScrollComponentRef(scrollX, scrollY)

  render(
    <CanvasContainer
      drawableItems={drawableItems}
      canvasWidth={1000}
      canvasHeight={500}
      parentComponentRef={mockParentComponentRef}
      onItemPositionChange={jest.fn()}
      onItemSelectionChange={jest.fn()}
      onLink={onLinkFunction}
      drawLineToMouse={true} />
  )

  const canvasComponent = screen.getByTestId('canvas-component-test-id')
  const clickPosition = { clientX: 140, clientY: 100 }
  const upPosition = { clientX: 172, clientY: 120 }

  await fireEvent.mouseDown(canvasComponent, clickPosition)
  await fireEvent.mouseMove(canvasComponent, upPosition)
  await fireEvent.mouseUp(canvasComponent)

  const sourcePosition = generatePosition(clickPosition.clientX + scrollX, clickPosition.clientY + scrollY)
  const destinationPosition = generatePosition(upPosition.clientX + scrollX, upPosition.clientY + scrollY)

  expect(onLinkFunction).toBeCalledWith(item2, sourcePosition, destinationPosition)
})

test('test link items without destination', async () => {
  const itemPosition1 = generatePosition(100, 100, 100, 100)
  const itemPosition2 = generatePosition(202, 100, 100, 100)

  const drawFunction = jest.fn()
  const onLinkFunction = jest.fn()

  const item1 = generateDrawableItem(itemPosition1, drawFunction)
  const item2 = generateDrawableItem(itemPosition2, drawFunction)

  const drawableItems = [item1, item2]
  const scrollX = 50
  const scrollY = 50
  const mockParentComponentRef = generateScrollComponentRef(scrollX, scrollY)

  render(
    <CanvasContainer
      drawableItems={drawableItems}
      canvasWidth={1000}
      canvasHeight={500}
      parentComponentRef={mockParentComponentRef}
      onItemPositionChange={jest.fn()}
      onItemSelectionChange={jest.fn()}
      onLink={onLinkFunction}
      drawLineToMouse={true} />
  )

  const canvasComponent = screen.getByTestId('canvas-component-test-id')
  const clickPosition = { clientX: 140, clientY: 100 }
  const upPosition = { clientX: 1720, clientY: 120 }

  await fireEvent.mouseDown(canvasComponent, clickPosition)
  await fireEvent.mouseMove(canvasComponent, upPosition)
  await fireEvent.mouseUp(canvasComponent)

  expect(onLinkFunction).not.toBeCalled()
})
