import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Workspace from '../../../models/workspace'
import WorkspaceListComponent from '../workspace-list-component'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test edit workspace success - complete flow', async () => {
  const workspaceId = 'workpace_id'
  const oldDescription = 'old description'
  const newWorkspaceDescription = 'new workspace description'

  const workspace: Workspace = {
    id: workspaceId,
    name: 'Workspace',
    description: oldDescription
  }

  server.use(rest.get('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([workspace]), ctx.delay(50))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${workspaceId}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(workspace), ctx.delay(50))
  }))

  server.use(rest.put(`http://localhost:5000/workspace/${workspaceId}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ ...workspace, description: newWorkspaceDescription }), ctx.delay(50))
  }))

  const { store } = renderWithProvideres(<BrowserRouter><WorkspaceListComponent /></BrowserRouter>)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-list-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-list-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('list-workspace-card-0')).toBeInTheDocument()
  })

  const workspaceCard = screen.getByTestId('list-workspace-card-0')

  fireEvent.click(workspaceCard)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent(oldDescription)
  })

  const editButton = screen.getByTestId('edit-workspace-button')
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId('create-workspace-component-save-button')).toBeInTheDocument()
  })

  const saveButtonComponent = screen.getByTestId('create-workspace-component-save-button')
  const descriptionComponent = screen.getByTestId('create-workspace-component-description')

  fireEvent.change(descriptionComponent, { target: { value: newWorkspaceDescription } })
  await fireEvent.click(saveButtonComponent)

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
    expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent(newWorkspaceDescription)
  })
})
