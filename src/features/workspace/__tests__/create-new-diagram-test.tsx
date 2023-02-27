import React from 'react'

import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BrowserRouter } from 'react-router-dom'
import WorkspaceComponent from '../workspace-component'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('create new workspace error', async () => {
  const errorDescription = 'Name is required'

  server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ description: errorDescription }), ctx.delay(150))
  }))

  const { store } = renderWithProvideres(<BrowserRouter><WorkspaceComponent /></BrowserRouter>)

  const nameComponent = screen.getByTestId('create-workspace-component-name')
  const descriptionComponent = screen.getByTestId('create-workspace-component-description')
  const saveButtonComponent = screen.getByTestId('create-workspace-component-save-button')

  const workspaceName = 'Name test'
  const workspaceDescription = 'Description test'

  fireEvent.change(nameComponent, { target: { value: workspaceName } })
  fireEvent.change(descriptionComponent, { target: { value: workspaceDescription } })

  fireEvent.click(saveButtonComponent)

  expect(screen.queryByTestId('new-workspace-component-progress')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error.description).toEqual(errorDescription)
    // if item has disabled is not possible to edit it
    expect(descriptionComponent).not.toHaveAttribute('disabled')
    // the item has value if the edit is enabled
    expect(nameComponent).toHaveAttribute('value')
  })
})

test('create new workspace success', async () => {
  const { store } = renderWithProvideres(<BrowserRouter><WorkspaceComponent /></BrowserRouter>)

  const workspaceName = 'Name test'
  const workspaceDescription = 'Description test'

  server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 'item-id', name: workspaceName, description: workspaceDescription }), ctx.delay(150))
  }))

  const nameComponent = screen.getByTestId('create-workspace-component-name')
  const descriptionComponent = screen.getByTestId('create-workspace-component-description')
  const saveButtonComponent = screen.getByTestId('create-workspace-component-save-button')

  fireEvent.change(nameComponent, { target: { value: workspaceName } })
  fireEvent.change(descriptionComponent, { target: { value: workspaceDescription } })

  fireEvent.click(saveButtonComponent)

  expect(screen.queryByTestId('new-workspace-component-progress')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
  })
})
