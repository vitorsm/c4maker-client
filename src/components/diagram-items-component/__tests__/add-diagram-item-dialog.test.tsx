import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import DiagramItemsComponent from '../diagram-items-component'
import AddDiagramItemDialog from '../add-diagram-item-dialog'

test('update diagram item', async () => {
  const addNewItemButtonKey = 'diagram-button-create-new-item'
  const diagramItemNameInputKey = 'new-diagram-item-name-input'
  // assert all attributes including type
  // const onOkClick = jest.fn()

  // render(
  //   <AddDiagramItemDialog />
  // )

  // const buttonComponent = screen.getByTestId(addNewItemButtonKey)

  // fireEvent.click(buttonComponent)

  // await waitFor(() => {
  //   expect(screen.getByTestId(diagramItemNameInputKey)).toBeVisible()
  // })
})

test('test cancel modal', async () => {

})
