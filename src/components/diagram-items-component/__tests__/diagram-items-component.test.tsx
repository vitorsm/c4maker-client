import React from 'react'
import { render, screen } from '@testing-library/react'
import DiagramItemsComponent from '../diagram-items-component'
import { generateDiagramItem, generatePosition } from '../../../utils/jest.mock'
import { act } from 'react-dom/test-utils'

jest.mock('../../canvas-container/canvas-container', () => ({
  __esModule: true,
  default: (customProps: any) => {
    const MockName = 'mocked-component-canvas'
    return <MockName {...customProps} data-testid={'canvas-component-for-test'} />
  }
}))

test('test add diagram item', async () => {
  const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]

  render(
    <DiagramItemsComponent
      diagramItems={diagramItems}
      onDiagramItemChange={jest.fn()}
      onDiagramItemAdded={jest.fn()}
      onDiagramItemDeleted={jest.fn()}/>
  )

  const canvasComponent = screen.getByTestId('canvas-component-for-test')
  const canvasContainerParamters = Object.values(canvasComponent)[1]

  expect(canvasContainerParamters.drawableItems.length).toBe(3)
  expect(canvasContainerParamters.drawableItems.map(i => i.id)).toStrictEqual(diagramItems.map(i => i.workspaceItem.key))
})

test('test updating item position', async () => {
  const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]
  const newPosition = generatePosition(100, 100, 100, 100)

  render(
    <DiagramItemsComponent
      diagramItems={diagramItems}
      onDiagramItemChange={jest.fn()}
      onDiagramItemAdded={jest.fn()}
      onDiagramItemDeleted={jest.fn()}/>
  )

  const canvasComponent = screen.getByTestId('canvas-component-for-test')
  const canvasContainerParamters = Object.values(canvasComponent)[1]
  const drawableItem: any = {
    id: diagramItems[1].workspaceItem.key,
    position: newPosition,
    isSelected: true
  }

  canvasContainerParamters.onItemPositionChange(drawableItem, newPosition)
  expect(diagramItems[1].canvasData.position).toStrictEqual(newPosition)
  expect(diagramItems[0].canvasData.position).toBeNull()
  expect(diagramItems[2].canvasData.position).toBeNull()
  expect(diagramItems[1].isSelected).toBeTruthy()
  expect(diagramItems[0].isSelected).toBeFalsy()
  expect(diagramItems[2].isSelected).toBeFalsy()
})

test('test updating item selection', async () => {
  const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]
  const newPosition = generatePosition(100, 100, 100, 100)

  render(
    <DiagramItemsComponent
      diagramItems={diagramItems}
      onDiagramItemChange={jest.fn()}
      onDiagramItemAdded={jest.fn()}
      onDiagramItemDeleted={jest.fn()}/>
  )

  const canvasComponent = screen.getByTestId('canvas-component-for-test')
  const canvasContainerParamters = Object.values(canvasComponent)[1]

  const drawableItems = diagramItems.map(diagramItem => ({
    id: diagramItem.workspaceItem.key,
    position: newPosition,
    isSelected: false
  }))

  drawableItems[0].isSelected = true

  act(() => {
    canvasContainerParamters.onItemSelectionChange(drawableItems)
  })

  expect(diagramItems[0].isSelected).toBeTruthy()
  expect(diagramItems[1].isSelected).toBeFalsy()
  expect(diagramItems[2].isSelected).toBeFalsy()
})
