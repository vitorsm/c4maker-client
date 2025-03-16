import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import WorkspaceComponent from '../workspace-component'
import { act } from 'react-dom/test-utils'
import { WorkspaceTypes } from '../../../store/reducers/workspaces/reducer'
import Workspace from '../../../models/workspace'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const WORKSPACE_ID = 'WORKSPACE_ID'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { workspaceId: WORKSPACE_ID }
  }
}))

test('test delete workspace error', async () => {
  const errorDescription = 'Current user has no permission'
  const mockWorkspace: Workspace = {
    id: WORKSPACE_ID,
    name: 'Workspace',
    description: null
  }

  server.use(rest.get(`http://localhost:5000/workspace/${WORKSPACE_ID}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockWorkspace), ctx.delay(150))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${WORKSPACE_ID}/diagrams`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${WORKSPACE_ID}/workspace-items`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  server.use(rest.delete(`http://localhost:5000/workspace/${WORKSPACE_ID}`, (req, res, ctx) => {
    return res(ctx.status(403), ctx.json({ description: errorDescription }), ctx.delay(150))
  }))

  const { store } = renderWithProvideres(<BrowserRouter><WorkspaceComponent /></BrowserRouter>)

  act(() => {
    store.dispatch({
      type: WorkspaceTypes.GET_USER_WORKSPACE,
      payload: {
        errorDescription: null,
        data: mockWorkspace,
        error: false
      }
    })
  })

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-button')).toBeInTheDocument()
  })

  const deleteButton = screen.getByTestId('delete-workspace-button')

  fireEvent.click(deleteButton)

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-dialog')).toBeInTheDocument()
  })

  const deleteConfirmationButton = screen.getByTestId('delete-workspace-dialog-dialog-ok-btn')

  fireEvent.click(deleteConfirmationButton)

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error.description).toEqual(errorDescription)
  })
})

test('test delete workspace success', async () => {
  const mockWorkspace: Workspace = {
    id: WORKSPACE_ID,
    name: 'Workspace',
    description: null
  }

  server.use(rest.get(`http://localhost:5000/workspace/${WORKSPACE_ID}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockWorkspace), ctx.delay(150))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${WORKSPACE_ID}/diagrams`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${WORKSPACE_ID}/workspace-items`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  server.use(rest.delete(`http://localhost:5000/workspace/${WORKSPACE_ID}`, (req, res, ctx) => {
    return res(ctx.status(204), ctx.json(null), ctx.delay(150))
  }))

  const { store } = renderWithProvideres(<BrowserRouter><WorkspaceComponent /></BrowserRouter>)

  act(() => {
    store.dispatch({
      type: WorkspaceTypes.GET_USER_WORKSPACE,
      payload: {
        errorDescription: null,
        data: mockWorkspace,
        error: false
      }
    })
  })

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-button')).toBeInTheDocument()
  })

  const deleteButton = screen.getByTestId('delete-workspace-button')

  fireEvent.click(deleteButton)

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-dialog')).toBeInTheDocument()
  })

  const deleteConfirmationButton = screen.getByTestId('delete-workspace-dialog-dialog-ok-btn')

  fireEvent.click(deleteConfirmationButton)

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
  })
})
