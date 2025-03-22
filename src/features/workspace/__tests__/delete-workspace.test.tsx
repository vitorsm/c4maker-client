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

test('test delete workspace success', async () => {
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
})
