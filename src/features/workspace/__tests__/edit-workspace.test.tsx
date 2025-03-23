import React from 'react'
import { setupServer } from 'msw/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Workspace from '../../../models/workspace'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import MainAuthenticatedRoute from '../../main-authenticated-route'
import { assertAfterSaveWorkspace, mockServerForUpdating, openWorkspaceComponent } from './test_utils.workspace'
import { mockWorkspace } from './mock.workspace'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test edit workspace success description - complete flow', async () => {
  const workspaceId = 'workpace_id1'
  const oldName = 'Workspace'
  const oldDescription = 'old description'
  const newWorkspaceDescription = 'new workspace description'

  const workspace = mockWorkspace(workspaceId, oldName, oldDescription)
  const anotherWorkspace = mockWorkspace('another_id', 'Another workspace')

  const saveButtonTestId = 'create-workspace-component-save-button'
  const editButtonTestId = 'edit-workspace-button'
  const descriptionTestId = 'create-workspace-component-description'

  mockServerForUpdating(server, workspace, undefined, newWorkspaceDescription, undefined, [workspace, anotherWorkspace])

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponent(store, oldDescription)

  const editButton = screen.getByTestId(editButtonTestId)
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId(saveButtonTestId)).toBeInTheDocument()
  })

  const saveButtonComponent = screen.getByTestId(saveButtonTestId)
  const descriptionComponent = screen.getByTestId(descriptionTestId)

  fireEvent.change(descriptionComponent, { target: { value: newWorkspaceDescription } })

  await fireEvent.click(saveButtonComponent)
  await assertAfterSaveWorkspace(store, null, newWorkspaceDescription, null, true)
})

test('test edit workspace name success - complete flow', async () => {
  const workspaceId = 'workpace_id2'
  const oldName = 'old name'
  const newName = 'new name'
  const description = 'Description'

  const workspace = mockWorkspace(workspaceId, oldName, description)

  mockServerForUpdating(server, workspace, newName, undefined)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponent(store, description)

  const editButton = screen.getByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-edit-button`)
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-confirm-button`)).toBeInTheDocument()
  })

  const saveButtonComponent = screen.getByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-confirm-button`)
  const nameComponent = screen.getByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-text-input-1`)

  fireEvent.change(nameComponent, { target: { value: newName } })
  await fireEvent.click(saveButtonComponent)

  await assertAfterSaveWorkspace(store, newName, null, null)
})

test('test cancelling the editing of workspace', async () => {
  const workspaceId = 'workpace_id2'
  const oldName = 'old name'
  const newName = 'new name'

  const workspace = mockWorkspace(workspaceId, oldName)

  const editButtonTestId = 'edit-workspace-button'
  const cancelButtonTestId = 'create-workspace-component-cancel-button'

  mockServerForUpdating(server, workspace, newName, undefined)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponent(store, '')

  const editButton = screen.getByTestId(editButtonTestId)
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId(editButtonTestId)).not.toBeInTheDocument()
    expect(screen.queryByTestId(cancelButtonTestId)).toBeInTheDocument()
  })

  const cancelButtonComponent = screen.getByTestId(cancelButtonTestId)
  fireEvent.click(cancelButtonComponent)

  await waitFor(() => {
    expect(screen.queryByTestId(cancelButtonTestId)).not.toBeInTheDocument()
    expect(screen.queryByTestId(editButtonTestId)).toBeInTheDocument()
  })
})

test('test edit without by description a workspace id', async () => {
  const workspaceId = 'workpace_id1'
  const oldName = 'Workspace'
  const oldDescription = 'old description'
  const newWorkspaceDescription = 'new workspace description'

  const workspace = mockWorkspace(workspaceId, oldName, oldDescription)
  workspace.id = undefined

  const saveButtonTestId = 'create-workspace-component-save-button'
  const editButtonTestId = 'edit-workspace-button'
  const descriptionTestId = 'create-workspace-component-description'

  mockServerForUpdating(server, workspace, undefined, newWorkspaceDescription, workspaceId)

  renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><MainAuthenticatedRoute /></MemoryRouter>)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).not.toBeInTheDocument()
    // it will be empty because the workspace id is different from the path, then it will not fill the inputs
    expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent('')
  })

  const editButton = screen.getByTestId(editButtonTestId)
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId(saveButtonTestId)).toBeInTheDocument()
  })

  const saveButtonComponent = screen.getByTestId(saveButtonTestId)
  const descriptionComponent = screen.getByTestId(descriptionTestId)

  fireEvent.change(descriptionComponent, { target: { value: newWorkspaceDescription } })

  await fireEvent.click(saveButtonComponent)

  // if there is workspace id, it should't perform any action, then the save button will still visible
  await waitFor(() => {
    expect(screen.queryByTestId(saveButtonTestId)).toBeInTheDocument()
  })
})
