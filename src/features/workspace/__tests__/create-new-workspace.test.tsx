import React from 'react'

import { screen, fireEvent } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router-dom'
import WorkspaceComponent, { NEW_WORKSPACE_NAME } from '../workspace-component'
import { mockChangeInBreadcrumbs } from '../../../__tests__/test_utils'
import { assertAfterSaveWorkspace, mockServerForCreating, openWorkspaceComponentToCreate } from './test_utils.workspace'
import MainAuthenticatedRoute from '../../main-authenticated-route'
import Workspace from '../../../models/workspace'
import { mockWorkspace } from './mock.workspace'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

test('create new workspace error', async () => {
  const errorDescription = 'Name is required'

  mockServerForCreating(server, undefined, errorDescription)

  const breadcrumbsItems = new Map()
  breadcrumbsItems.set(0, {
    key: null,
    name: '',
    details: null,
    onClick: null,
    editable: true
  })

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><WorkspaceComponent /></MemoryRouter>)

  // this dispatch simulates the edit of the breadcrumbs, that is used to update the workspace name
  mockChangeInBreadcrumbs(store, breadcrumbsItems.get(0))

  await assertAfterSaveWorkspace(store, null, null, errorDescription)
})

test('create new workspace from name success', async () => {
  const workspaceName = NEW_WORKSPACE_NAME
  const workspaceDescription = null

  const workspaceCreated = mockWorkspace('item-id-test-1', workspaceName, workspaceDescription)

  mockServerForCreating(server, workspaceCreated)

  const breadcrumbsItems = new Map()
  breadcrumbsItems.set(0, {
    key: null,
    name: '',
    details: null,
    onClick: null,
    editable: true
  })

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><MainAuthenticatedRoute /></MemoryRouter>)

  await openWorkspaceComponentToCreate()

  // this dispatch simulates the edit of the breadcrumbs, that is used to update the workspace name
  mockChangeInBreadcrumbs(store, breadcrumbsItems.get(0))

  await assertAfterSaveWorkspace(store, workspaceName, workspaceDescription, null)
})

// false - true
test('create new workspace from details success', async () => {
  const workspaceName = NEW_WORKSPACE_NAME
  const workspaceDescription = 'Description test'

  const breadcrumbsItems = new Map()
  breadcrumbsItems.set(0, {
    key: 'new_item',
    name: NEW_WORKSPACE_NAME,
    details: workspaceDescription,
    onClick: null,
    editable: true
  })

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['/workspaces/new']}><MainAuthenticatedRoute /></MemoryRouter>)

  const workspaceToCreate = mockWorkspace('item-id-test-2', workspaceName, workspaceDescription)

  mockServerForCreating(server, workspaceToCreate)

  const descriptionComponent = screen.getByTestId('create-workspace-component-description')
  const saveButtonComponent = screen.getByTestId('create-workspace-component-save-button')

  fireEvent.change(descriptionComponent, { target: { value: workspaceDescription } })
  await fireEvent.click(saveButtonComponent)

  await assertAfterSaveWorkspace(store, NEW_WORKSPACE_NAME, workspaceDescription, null, true)
})
