import React from 'react'
import { setupServer } from 'msw/node'
import { renderWithProvideres } from '../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import Workspace from '../../../models/workspace'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import MainAuthenticatedRoute from '../../main-authenticated-route'
import { assertAfterSaveWorkspace, mockServerForUpdating, openWorkspaceComponent } from './test_utils.workspace'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test edit workspace success description - complete flow', async () => {
  const workspaceId = 'workpace_id1'
  const oldDescription = 'old description'
  const newWorkspaceDescription = 'new workspace description'

  const workspace: Workspace = {
    id: workspaceId,
    name: 'Workspace',
    description: oldDescription
  }

  mockServerForUpdating(server, workspace, undefined, newWorkspaceDescription)

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponent(store, oldDescription)

  const editButton = screen.getByTestId('edit-workspace-button')
  await fireEvent.click(editButton)

  await waitFor(() => {
    expect(screen.queryByTestId('create-workspace-component-save-button')).toBeInTheDocument()
  })

  const saveButtonComponent = screen.getByTestId('create-workspace-component-save-button')
  const descriptionComponent = screen.getByTestId('create-workspace-component-description')

  fireEvent.change(descriptionComponent, { target: { value: newWorkspaceDescription } })

  await fireEvent.click(saveButtonComponent)
  await assertAfterSaveWorkspace(store, null, newWorkspaceDescription, null, true)
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
