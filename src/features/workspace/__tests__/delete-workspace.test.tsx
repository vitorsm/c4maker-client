import React from 'react'
import { setupServer } from 'msw/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Workspace from '../../../models/workspace'
import MainAuthenticatedRoute from '../../main-authenticated-route'
import { assertAfterSaveWorkspace, mockServerForDelete } from './test_utils.workspace'
import { mockLoadCurrentUser } from '../../../__tests__/test_utils'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test delete workspace error', async () => {
  const workspaceId = 'workspace_id'
  const errorDescription = 'Current user has no permission'
  const mockWorkspace: Workspace = {
    id: workspaceId,
    name: 'Workspace',
    description: null
  }

  mockServerForDelete(server, mockWorkspace, errorDescription)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><MainAuthenticatedRoute /></MemoryRouter>)

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

  await assertAfterSaveWorkspace(store, null, null, errorDescription, true)
})

const testDeleteWorkspace = async (withoutListOfWorkspaces: boolean): Promise<void> => {
  const workspaceId = 'workspace_id'
  const mockWorkspace: Workspace = {
    id: workspaceId,
    name: 'Workspace',
    description: null
  }

  const anotherWorkspace: Workspace = {
    id: 'another_workspace_id',
    name: 'Another Workspace',
    description: null
  }

  mockServerForDelete(server, mockWorkspace, undefined, [mockWorkspace, anotherWorkspace], withoutListOfWorkspaces)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><MainAuthenticatedRoute /></MemoryRouter>)

  mockLoadCurrentUser(store)

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

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-empty-state-new-item-link'))
  })
}

test('test delete workspace success', async () => {
  await testDeleteWorkspace(false)
})

test('test delete with no workspace list', async () => {
  await testDeleteWorkspace(true)
})

test('test canceling the deletion', async () => {
  const workspaceId = 'workspace_id'
  const mockWorkspace: Workspace = {
    id: workspaceId,
    name: 'Workspace',
    description: null
  }

  const anotherWorkspace: Workspace = {
    id: 'another_workspace_id',
    name: 'Another Workspace',
    description: null
  }

  mockServerForDelete(server, mockWorkspace, undefined, [mockWorkspace, anotherWorkspace])

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><MainAuthenticatedRoute /></MemoryRouter>)

  mockLoadCurrentUser(store)

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-button')).toBeInTheDocument()
  })

  const deleteButton = screen.getByTestId('delete-workspace-button')

  fireEvent.click(deleteButton)

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-dialog')).toBeInTheDocument()
  })

  const deleteCancelButton = screen.getByTestId('delete-workspace-dialog-dialog-cancel-btn')

  fireEvent.click(deleteCancelButton)

  await waitFor(() => {
    expect(screen.queryByTestId('delete-workspace-button')).toBeInTheDocument()
  })
})

test('test deletion without a workspace.id', async () => {
  // this shouldn't be possible because the button to delete will be available only for a workspace that exists. If the workspace exists it has a valid id.
  // I'm forcing this scenario to ensure the test coverage
  const workspaceId = 'workspace_id'
  const mockWorkspace: Workspace = {
    id: undefined,
    name: 'Workspace',
    description: null
  }

  const anotherWorkspace: Workspace = {
    id: 'another_workspace_id',
    name: 'Another Workspace',
    description: null
  }

  mockServerForDelete(server, mockWorkspace, undefined, [mockWorkspace, anotherWorkspace], false, workspaceId)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><MainAuthenticatedRoute /></MemoryRouter>)

  mockLoadCurrentUser(store)

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
    expect(screen.queryByTestId('delete-workspace-button')).toBeInTheDocument()
  })
})
