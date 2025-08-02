import React from 'react'
import { render, screen } from '@testing-library/react'
import DiagramItemsComponent from '../diagram-items-component'
import { generateDiagramItem, generatePosition } from '../../../utils/jest.mock'
import { act } from 'react-dom/test-utils'
import { WorkspaceItemType } from '../../../models/workspace'
import { assertFuncCalledWithDiagramItem, assertModalInputValues, changeDigramItemValues, clickCancelDeleteDialog, clickDrawableItem, clickOkDeleteDialog, clickOkDiagramItemDialog, closeAddNewModal, openAddNewItemModal, openDeleteDiagramItem, openEditDiagramItem } from './test_utils.diagram-items'

jest.mock('../../canvas-container/canvas-container', () => ({
  __esModule: true,
  default: (customProps: any) => {
    const MockName = 'mocked-component-canvas'
    return <MockName {...customProps} data-testid={'canvas-component-for-test'} />
  }
}))

// test('test list diagram item', async () => {
//   const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   const canvasComponent = screen.getByTestId('canvas-component-for-test')
//   const canvasContainerParamters = Object.values(canvasComponent)[1]

//   expect(canvasContainerParamters.drawableItems.length).toBe(3)
//   expect(canvasContainerParamters.drawableItems.map(i => i.id)).toStrictEqual(diagramItems.map(i => i.workspaceItem.key))
// })

// test('test updating item position', async () => {
//   const diagramItems = [generateDiagramItem(true), generateDiagramItem(), generateDiagramItem()]
//   const newPosition = generatePosition(100, 100, 100, 100)
//   const firstItemPosition = { ...diagramItems[0].data.position }

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   const canvasComponent = screen.getByTestId('canvas-component-for-test')
//   const canvasContainerParamters = Object.values(canvasComponent)[1]
//   const drawableItem: any = {
//     id: diagramItems[1].workspaceItem.key,
//     position: newPosition,
//     isSelected: true
//   }

//   canvasContainerParamters.onItemPositionChange(drawableItem, newPosition)
//   expect(diagramItems[1].data.position).toStrictEqual(newPosition)
//   expect(diagramItems[0].data.position).toStrictEqual(firstItemPosition)
//   expect(diagramItems[2].data.position).toBeNull()
//   expect(diagramItems[1].isSelected).toBeTruthy()
//   expect(diagramItems[0].isSelected).toBeFalsy()
//   expect(diagramItems[2].isSelected).toBeFalsy()
// })

// test('test updating item position without item', async () => {
//   const diagramItems = [generateDiagramItem(true), generateDiagramItem(), generateDiagramItem()]
//   const newPosition = generatePosition(100, 100, 100, 100)

//   const onDiagramItemChange = jest.fn()
//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={onDiagramItemChange}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   const canvasComponent = screen.getByTestId('canvas-component-for-test')
//   const canvasContainerParamters = Object.values(canvasComponent)[1]
//   const drawableItem: any = {
//     id: 'invalid id',
//     position: newPosition,
//     isSelected: true
//   }

//   act(() => {
//     canvasContainerParamters.onItemPositionChange(drawableItem, newPosition)
//   })

//   expect(onDiagramItemChange).not.toBeCalled()
// })

// test('test updating item selection', async () => {
//   const diagramItems = [generateDiagramItem(true, WorkspaceItemType.MOBILE_CONTAINER), generateDiagramItem(), generateDiagramItem()]
//   const newPosition = generatePosition(100, 100, 100, 100)

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   const canvasComponent = screen.getByTestId('canvas-component-for-test')
//   const canvasContainerParamters = Object.values(canvasComponent)[1]

//   const drawableItems = diagramItems.map(diagramItem => ({
//     id: diagramItem.workspaceItem.key,
//     position: newPosition,
//     isSelected: false
//   }))

//   drawableItems[0].isSelected = true

//   act(() => {
//     canvasContainerParamters.onItemSelectionChange(drawableItems)
//   })

//   expect(diagramItems[0].isSelected).toBeTruthy()
//   expect(diagramItems[1].isSelected).toBeFalsy()
//   expect(diagramItems[2].isSelected).toBeFalsy()
// })

// test('test open add modal and close', async () => {
//   render(
//     <DiagramItemsComponent
//       diagramItems={[]}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await openAddNewItemModal()
//   await closeAddNewModal()
// })

// test('test add new diagram item', async () => {
//   const itemName = 'item name'
//   const itemDescription = 'item description'
//   const itemDetails = 'item details'

//   const onDiagramItemAdded = jest.fn()

//   render(
//     <DiagramItemsComponent
//       diagramItems={[]}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={onDiagramItemAdded}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await openAddNewItemModal()
//   changeDigramItemValues(itemName, itemDescription, itemDetails)

//   clickOkDiagramItemDialog()

//   assertFuncCalledWithDiagramItem(onDiagramItemAdded, undefined, itemName, itemDescription, itemDetails, WorkspaceItemType.PERSONA)
// })

// test('test open edit diagram item with null values', async () => {
//   const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]
//   diagramItems[0].workspaceItem.description = null
//   diagramItems[0].workspaceItem.details = null

//   const onDiagramItemChanged = jest.fn()

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={onDiagramItemChanged}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await openEditDiagramItem(diagramItems[0].workspaceItem.key, diagramItems)

//   const workspaceItem = diagramItems[0].workspaceItem

//   await assertModalInputValues(workspaceItem.name, '', '', workspaceItem.workspaceItemType)
// })

// test('test edit diagram item', async () => {
//   const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]

//   const newItemName = 'new name'
//   const newItemDescription = 'new description'
//   const newItemDetails = 'new details'
//   const newItemType = WorkspaceItemType.MOBILE_CONTAINER

//   const onDiagramItemChanged = jest.fn()

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={onDiagramItemChanged}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await openEditDiagramItem(diagramItems[0].workspaceItem.key, diagramItems)

//   const workspaceItem = diagramItems[0].workspaceItem

//   await assertModalInputValues(workspaceItem.name, workspaceItem.description, workspaceItem.details, workspaceItem.workspaceItemType)

//   changeDigramItemValues(newItemName, newItemDescription, newItemDetails, newItemType)

//   clickOkDiagramItemDialog()

//   assertFuncCalledWithDiagramItem(onDiagramItemChanged, diagramItems[0].id, newItemName, newItemDescription, newItemDetails, newItemType)
// })

// test('test edit diagram item, close and change values', async () => {
//   const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]

//   const newItemName = 'new name'
//   const newItemDescription = 'new description'
//   const newItemDetails = 'new details'
//   const newItemType = WorkspaceItemType.MOBILE_CONTAINER

//   const onDiagramItemChanged = jest.fn()

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={onDiagramItemChanged}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await openEditDiagramItem(diagramItems[0].workspaceItem.key, diagramItems)

//   const workspaceItem = diagramItems[0].workspaceItem

//   await assertModalInputValues(workspaceItem.name, workspaceItem.description, workspaceItem.details, workspaceItem.workspaceItemType)

//   await closeAddNewModal()

//   setTimeout(() => {}, 1000)

//   changeDigramItemValues(newItemName, newItemDescription, newItemDetails, newItemType)

//   expect(onDiagramItemChanged).not.toBeCalled()
// })

// test('test open delete diagram item and cancel', async () => {
//   const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await openDeleteDiagramItem(diagramItems[1].workspaceItem.key, diagramItems)
//   await clickCancelDeleteDialog()
// })

// test('test delete diagram item', async () => {
//   const diagramItems = [generateDiagramItem(), generateDiagramItem(), generateDiagramItem()]

//   const onItemDeleted = jest.fn()
//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={jest.fn()}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={onItemDeleted}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   const diagramItemToDelete = diagramItems[1]
//   await openDeleteDiagramItem(diagramItemToDelete.workspaceItem.key, diagramItems)
//   await clickOkDeleteDialog()

//   assertFuncCalledWithDiagramItem(onItemDeleted, diagramItemToDelete.id, diagramItemToDelete.workspaceItem.name,
//     diagramItemToDelete.workspaceItem.description, diagramItemToDelete.workspaceItem.details, diagramItemToDelete.workspaceItem.workspaceItemType)
// })

// test('test on link', async () => {
//   const diagramItems = [generateDiagramItem(true, WorkspaceItemType.MOBILE_CONTAINER), generateDiagramItem(true), generateDiagramItem()]
//   const newPosition = generatePosition(100, 100, 100, 100)

//   const onDiagramItemChange = jest.fn()

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={onDiagramItemChange}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   await clickDrawableItem(diagramItems[0].workspaceItem.key, diagramItems)

//   const targetDrawableItem = {
//     id: diagramItems[1].workspaceItem.key,
//     position: newPosition,
//     isSelected: false
//   }
//   const fromPosition = {
//     x: 100,
//     y: 100
//   }
//   const toPosition = {
//     x: 200,
//     y: 200
//   }

//   const canvasComponent = screen.getByTestId('canvas-component-for-test')
//   const canvasContainerParamters = Object.values(canvasComponent)[1]

//   act(() => {
//     canvasContainerParamters.onLink(targetDrawableItem, fromPosition, toPosition)
//   })

//   expect(onDiagramItemChange).toBeCalled()
//   const diagramItemUpdated = onDiagramItemChange.mock.calls[0][0][0]

//   const expectedFromPositionX = fromPosition.x - diagramItems[0].data.position.x
//   const expectedFromPositionY = fromPosition.y - diagramItems[0].data.position.y
//   const expectedToPositionX = toPosition.x - diagramItems[1].data.position.x
//   const expectedToPositionY = toPosition.y - diagramItems[1].data.position.y

//   expect(diagramItemUpdated.workspaceItem.key).toEqual(diagramItems[0].workspaceItem.key)
//   expect(diagramItemUpdated.relationships.length).toEqual(1)
//   expect(diagramItemUpdated.relationships[0].diagramItem.id).toEqual(diagramItems[1].id)
//   expect(diagramItemUpdated.relationships[0].data.fromPosition.x).toEqual(expectedFromPositionX)
//   expect(diagramItemUpdated.relationships[0].data.fromPosition.y).toEqual(expectedFromPositionY)
//   expect(diagramItemUpdated.relationships[0].data.toPosition.x).toEqual(expectedToPositionX)
//   expect(diagramItemUpdated.relationships[0].data.toPosition.y).toEqual(expectedToPositionY)
// })

// test('test on link without selected item', async () => {
//   const diagramItems = [generateDiagramItem(true, WorkspaceItemType.MOBILE_CONTAINER), generateDiagramItem(true), generateDiagramItem()]
//   const newPosition = generatePosition(100, 100, 100, 100)

//   const onDiagramItemChange = jest.fn()

//   render(
//     <DiagramItemsComponent
//       diagramItems={diagramItems}
//       onDiagramItemChange={onDiagramItemChange}
//       onDiagramItemAdded={jest.fn()}
//       onDiagramItemDeleted={jest.fn()}
//       onDiagramItemSelected={jest.fn()}/>
//   )

//   const targetDrawableItem = {
//     id: diagramItems[1].workspaceItem.key,
//     position: newPosition,
//     isSelected: false
//   }
//   const fromPosition = {
//     x: 100,
//     y: 100
//   }
//   const toPosition = {
//     x: 200,
//     y: 200
//   }

//   const canvasComponent = screen.getByTestId('canvas-component-for-test')
//   const canvasContainerParamters = Object.values(canvasComponent)[1]

//   act(() => {
//     canvasContainerParamters.onLink(targetDrawableItem, fromPosition, toPosition)
//   })

//   expect(onDiagramItemChange).not.toBeCalled()
// })

test('test clean dialog after save', async () => {
  const diagramItems = [generateDiagramItem(true, WorkspaceItemType.MOBILE_CONTAINER), generateDiagramItem(true), generateDiagramItem()]
  const newName = 'new name'
  const newDescription = 'new description'
  const newDetails = 'new details'
  const newType = WorkspaceItemType.COMPONENT

  render(
    <DiagramItemsComponent
      diagramItems={diagramItems}
      onDiagramItemChange={jest.fn()}
      onDiagramItemAdded={jest.fn()}
      onDiagramItemDeleted={jest.fn()}
      onDiagramItemSelected={jest.fn()}/>
  )

  await openAddNewItemModal()

  changeDigramItemValues(newName, newDescription, newDetails, newType)
  await assertModalInputValues(newName, newDescription, newDetails, newType)
  await closeAddNewModal()

  await openAddNewItemModal()
  await assertModalInputValues('', '', '', WorkspaceItemType.PERSONA)
})

// console.log diagram item modified but not found
// test onlink
// open edit diagram item modal
// delete diagram item
// open delete and close
//
