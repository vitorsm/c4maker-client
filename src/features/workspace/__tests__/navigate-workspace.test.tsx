import React from 'react'
import { setupServer } from 'msw/lib/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import MainAuthenticatedRoute from '../../main-authenticated-route'
import Workspace from '../../../models/workspace'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { mockServerForCreating, mockServerForUpdating, openWorkspaceComponent, openWorkspaceComponentToCreate } from './test_utils.workspace'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test navigate using default path', async () => {
  const workspaceDescription = 'description'
  const workspaceId = 'workspace_id'
  const workspace: Workspace = {
    id: workspaceId,
    name: 'Workspace name',
    description: workspaceDescription
  }

  await mockServerForUpdating(server, workspace, undefined, undefined)

  renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><MainAuthenticatedRoute /></MemoryRouter>)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent(workspaceDescription)
  })
})

test('test navigate using breadcrumbs', async () => {
  const workspaceDescription = 'description'
  const workspace: Workspace = {
    id: 'workspace_id',
    name: 'Workspace name',
    description: workspaceDescription
  }
  const breadcrumbDataTestId = `${DEFAULT_BREADCRUMBS_TEST_ID}-text-link-0`

  await mockServerForUpdating(server, workspace, undefined, undefined)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponent(store, workspaceDescription)
  const breadcrumbItem = screen.getByTestId(breadcrumbDataTestId)

  fireEvent.click(breadcrumbItem)

  await waitFor(() => {
    expect(screen.queryByTestId('list-workspace-card-0')).toBeInTheDocument()
  })
})

test('test open edit workspace and cancel', async () => {
  const workspaceDescription = 'description'
  const workspace: Workspace = {
    id: 'workspace_id',
    name: 'Workspace name',
    description: workspaceDescription
  }
  const editButtonTestId = 'edit-workspace-button'
  const cancelButtonTestId = 'create-workspace-component-cancel-button'

  await mockServerForUpdating(server, workspace, undefined, undefined)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponent(store, workspaceDescription)
  const editButtonComponent = screen.getByTestId(editButtonTestId)

  fireEvent.click(editButtonComponent)

  await waitFor(() => {
    expect(screen.queryByTestId(editButtonTestId)).not.toBeInTheDocument()
    expect(screen.queryByTestId(cancelButtonTestId)).toBeInTheDocument()
  })

  const cancelButton = screen.getByTestId(cancelButtonTestId)
  fireEvent.click(cancelButton)

  await waitFor(() => {
    expect(screen.queryByTestId(cancelButtonTestId)).not.toBeInTheDocument()
    expect(screen.queryByTestId(editButtonTestId)).toBeInTheDocument()
  })
})

test('test open create workspace and cancel', async () => {
  const newWorkspaceLinkDataId = 'workspace-empty-state-new-item-link'
  const cancelButtonTestId = 'create-workspace-component-cancel-button'

  await mockServerForCreating(server, undefined)

  renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponentToCreate()

  const cancelButton = screen.getByTestId(cancelButtonTestId)
  fireEvent.click(cancelButton)

  await waitFor(() => {
    expect(screen.queryByTestId(newWorkspaceLinkDataId)).toBeInTheDocument()
  })
})
