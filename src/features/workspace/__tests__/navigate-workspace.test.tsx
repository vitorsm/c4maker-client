import React from 'react'
import { setupServer } from 'msw/lib/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import MainAuthenticatedRoute from '../../main-authenticated-route'
import { mockServerForUpdate, openWorkspaceToEdit } from './edit-workspace.test'
import Workspace from '../../../models/workspace'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import { fireEvent, screen, waitFor } from '@testing-library/react'

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

  await mockServerForUpdate(workspace, null, null)

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

  await mockServerForUpdate(workspace, null, null)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceToEdit(store, workspaceDescription)

  const breadcrumbItem = screen.getByTestId(breadcrumbDataTestId)

  fireEvent.click(breadcrumbItem)

  await waitFor(() => {
    expect(screen.queryByTestId('list-workspace-card-0')).toBeInTheDocument()
  })
})
