import { waitFor, screen, fireEvent, act } from '@testing-library/react'
import { WorkspaceItemType } from '../../../models/workspace'
import type { Mock } from 'jest-mock'
import { DiagramItem } from '../../../models/diagram'

const ADD_NEW_ITEM_BUTTON_TEST_ID = 'diagram-button-create-new-item'
const EDIT_ITEM_BUTTON_TEST_ID = 'diagram-item-edit-button'
const DELETE_ITEM_BUTTON_TEST_ID = 'diagram-item-delete-button'

const ADD_NEW_ITEM_DIALOG_OK_BUTTON_TEST_ID = 'add-new-diagram-item-dialog-ok-btn'
const ADD_NEW_ITEM_DIALOG_CANCEL_BUTTON_TEST_ID = 'add-new-diagram-item-dialog-cancel-btn'
export const TEST_CANVAS_CONTAINER_TEST_ID = 'canvas-component-for-test'

const ITEM_NAME_INPUT_TEST_ID = 'new-diagram-item-name-input'
const ITEM_DESCRIPTION_INPUT_TEST_ID = 'new-diagram-item-description-input'
const ITEM_DETAILS_INPUT_TEST_ID = 'new-diagram-item-details-input'
const ITEM_TYPE_INPUT_TEST_ID = 'new-diagram-item-type-input-select'

const DELETE_CONFIRMATION_DIALOG_TEST_ID = 'diagram-item-delete-confirmation-dialog'
const DELETE_ITEM_DIALOG_OK_BUTTON_TEST_ID = 'diagram-item-delete-confirmation-dialog-dialog-ok-btn'
const DELETE_ITEM_DIALOG_CANCEL_BUTTON_TEST_ID = 'diagram-item-delete-confirmation-dialog-dialog-cancel-btn'

export const openAddNewItemModal = async (): Promise<void> => {
  // check modal is not open - modal button is not visible
  const modalCancelButton = screen.getByTestId(ADD_NEW_ITEM_DIALOG_CANCEL_BUTTON_TEST_ID)
  expect(modalCancelButton).not.toBeVisible()

  // open the modal
  const addNewDiagramItemButton = screen.getByTestId(ADD_NEW_ITEM_BUTTON_TEST_ID)
  fireEvent.click(addNewDiagramItemButton)

  // check modal is open - modal button is visible
  await waitFor(() => {
    expect(modalCancelButton).toBeVisible()
  })
}

export const closeAddNewModal = async (): Promise<void> => {
  const modalCancelButton = screen.getByTestId(ADD_NEW_ITEM_DIALOG_CANCEL_BUTTON_TEST_ID)

  // check modal is open - modal button is visible
  await waitFor(() => {
    expect(modalCancelButton).toBeVisible()
  })

  // close modal
  fireEvent.click(modalCancelButton)

  // check modal is close
  await waitFor(() => {
    expect(modalCancelButton).not.toBeVisible()
  })
}

export const changeDigramItemValues = (
  newName?: string, newDescription?: string, newDetails?: string, newType?: WorkspaceItemType
): void => {
  const nameComponent = screen.getByTestId(ITEM_NAME_INPUT_TEST_ID)
  const descriptionComponent = screen.getByTestId(ITEM_DESCRIPTION_INPUT_TEST_ID)
  const detailsComponent = screen.getByTestId(ITEM_DETAILS_INPUT_TEST_ID)
  const typeComponent = screen.getByTestId(ITEM_TYPE_INPUT_TEST_ID)

  if (newName !== undefined) {
    fireEvent.change(nameComponent, { target: { value: newName } })
  }

  if (newDescription !== undefined) {
    fireEvent.change(descriptionComponent, { target: { value: newDescription } })
  }

  if (newDetails !== undefined) {
    fireEvent.change(detailsComponent, { target: { value: newDetails } })
  }

  if (newType !== undefined) {
    fireEvent.change(typeComponent, { target: { value: newType } })
  }
}

export const assertFuncCalledWithDiagramItem = (funcMock: Mock, itemId: string | undefined, itemName: string, itemDescription: string | null, itemDetails: string | null, itemType: WorkspaceItemType): void => {
  expect(funcMock).toBeCalled()
  const diagramItemUpdated = funcMock.mock.calls[0][0][0] || funcMock.mock.calls[0][0]

  expect(diagramItemUpdated.id).toEqual(itemId)
  expect(diagramItemUpdated.workspaceItem.name).toEqual(itemName)
  expect(diagramItemUpdated.workspaceItem.description).toEqual(itemDescription)
  expect(diagramItemUpdated.workspaceItem.details).toEqual(itemDetails)
  expect(diagramItemUpdated.workspaceItem.workspaceItemType).toEqual(itemType)
}

export const assertModalInputValues = (itemName: string, itemDescription: string | null, itemDetails: string | null, itemType: WorkspaceItemType): void => {
  const nameInputComponent = screen.getByTestId(ITEM_NAME_INPUT_TEST_ID)
  const descriptionInputComponent = screen.getByTestId(ITEM_DESCRIPTION_INPUT_TEST_ID)
  const detailsInputComponent = screen.getByTestId(ITEM_DETAILS_INPUT_TEST_ID)
  const typeInputComponent = screen.getByTestId(ITEM_TYPE_INPUT_TEST_ID)

  expect(nameInputComponent).toHaveValue(itemName)
  expect(descriptionInputComponent).toHaveValue(itemDescription)
  expect(detailsInputComponent).toHaveValue(itemDetails)
  expect(typeInputComponent).toHaveValue(itemType)
}

export const clickOkDiagramItemDialog = (): void => {
  // ok button to save new diagram item
  const okAddItemModalComponent = screen.getByTestId(ADD_NEW_ITEM_DIALOG_OK_BUTTON_TEST_ID)
  fireEvent.click(okAddItemModalComponent)
}

export const clickDrawableItem = async (clickedWorkspaceItemKey: string, diagramItems: DiagramItem[]): Promise<void> => {
  const canvasComponent = screen.getByTestId(TEST_CANVAS_CONTAINER_TEST_ID)
  const canvasContainerParamters = Object.values(canvasComponent)[1]

  const drawableItems = diagramItems.map(diagramItem => ({
    id: diagramItem.workspaceItem.key,
    isSelected: diagramItem.workspaceItem.key === clickedWorkspaceItemKey
  }))

  // simulating a click in a drawableItem in the canvas
  act(() => {
    canvasContainerParamters.onItemSelectionChange(drawableItems)
  })

  await waitFor(() => {
    expect(screen.getByTestId(EDIT_ITEM_BUTTON_TEST_ID)).toBeVisible()
  })
}

export const openEditDiagramItem = async (diagramItemKeyToOpen: string, diagramItems: DiagramItem[]): Promise<void> => {
  await clickDrawableItem(diagramItemKeyToOpen, diagramItems)

  const editButtonComponent = screen.getByTestId(EDIT_ITEM_BUTTON_TEST_ID)
  fireEvent.click(editButtonComponent)

  await waitFor(() => {
    expect(screen.getByTestId(ITEM_NAME_INPUT_TEST_ID)).toBeVisible()
  })
}

export const openDeleteDiagramItem = async (diagramItemKeyToOpen: string, diagramItems: DiagramItem[]): Promise<void> => {
  await clickDrawableItem(diagramItemKeyToOpen, diagramItems)

  const deleteButtonComponent = screen.getByTestId(DELETE_ITEM_BUTTON_TEST_ID)
  fireEvent.click(deleteButtonComponent)

  await waitFor(() => {
    expect(screen.getByTestId(DELETE_CONFIRMATION_DIALOG_TEST_ID)).toBeVisible()
  })
}

export const clickCancelDeleteDialog = async (): Promise<void> => {
  const cancelDeleteButton = screen.getByTestId(DELETE_ITEM_DIALOG_CANCEL_BUTTON_TEST_ID)
  fireEvent.click(cancelDeleteButton)

  await waitFor(() => {
    expect(screen.queryByTestId(DELETE_CONFIRMATION_DIALOG_TEST_ID)).not.toBeInTheDocument()
  })
}

export const clickOkDeleteDialog = async (): Promise<void> => {
  const okDeleteButton = screen.getByTestId(DELETE_ITEM_DIALOG_OK_BUTTON_TEST_ID)
  fireEvent.click(okDeleteButton)

  await waitFor(() => {
    expect(screen.queryByTestId(DELETE_CONFIRMATION_DIALOG_TEST_ID)).not.toBeInTheDocument()
  })
}

test('only to avoid error', () => {})
