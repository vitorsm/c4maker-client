import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Workspace from '../../../models/workspace'
import { act } from 'react-dom/test-utils'
import { UserTypes } from '../../../store/reducers/users/reducer'
import User from '../../../models/user'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import MainAuthenticatedRoute from '../../main-authenticated-route'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export const mockServerForUpdate = (workspace: Workspace, newWorkspaceDescription: string | null, newWorkspaceName: string | null): void => {
  const workspaceId = workspace.id ?? ''

  server.use(rest.get('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([workspace]), ctx.delay(50))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${workspaceId}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(workspace), ctx.delay(50))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${workspaceId}/diagrams`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${workspaceId}/workspace-items`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  const newWorkspace = { ...workspace }
  if (newWorkspaceDescription != null) {
    newWorkspace.description = newWorkspaceDescription
  }
  if (newWorkspaceName != null) {
    newWorkspace.name = newWorkspaceName
  }

  server.use(rest.put(`http://localhost:5000/workspace/${workspaceId}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(newWorkspace), ctx.delay(50))
  }))
}

const mockLoadCurrentUser = (store: any): void => {
  const mockCurrentUser: User = {
    name: 'UserName',
    login: 'login'
  }

  act(() => {
    store.dispatch({
      type: UserTypes.SET_CURRENT_USER,
      payload: mockCurrentUser
    })
  })
}

export const openWorkspaceToEdit = async (store: any, oldDescription: string): Promise<void> => {
  mockLoadCurrentUser(store)

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
}

test('test edit workspace success description - complete flow', async () => {
  const workspaceId = 'workpace_id1'
  const oldDescription = 'old description'
  const newWorkspaceDescription = 'new workspace description'

  const workspace: Workspace = {
    id: workspaceId,
    name: 'Workspace',
    description: oldDescription
  }

  mockServerForUpdate(workspace, newWorkspaceDescription, null)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceToEdit(store, oldDescription)

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

test('test edit workspace name success - complete flow', async () => {
  const workspaceId = 'workpace_id2'
  const oldName = 'old name'
  const newName = 'new name'
  const description = 'Description'

  const workspace: Workspace = {
    id: workspaceId,
    name: oldName,
    description
  }

  mockServerForUpdate(workspace, null, newName)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceToEdit(store, description)

  const editButton = screen.getByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-edit-button`)
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-confirm-button`)).toBeInTheDocument()
  })

  const saveButtonComponent = screen.getByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-confirm-button`)
  const nameComponent = screen.getByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-text-input-1`)

  fireEvent.change(nameComponent, { target: { value: newName } })
  await fireEvent.click(saveButtonComponent)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
    expect(screen.queryByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-text-link-1`)).toHaveTextContent(newName)
  })
})
