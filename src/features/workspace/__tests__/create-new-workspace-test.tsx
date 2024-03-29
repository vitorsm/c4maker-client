import React from 'react'

import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter } from 'react-router-dom'
import WorkspaceComponent, { NEW_WORKSPACE_NAME } from '../workspace-component'
import { BreadcrumbsTypes } from '../../../store/reducers/breadcrumbs/reducer'
import { act } from 'react-dom/test-utils'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

test('create new workspace error', async () => {
  const errorDescription = 'Name is required'

  server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ description: errorDescription }), ctx.delay(150))
  }))

  const breadcrumbsItems = new Map()
  breadcrumbsItems.set(0, {
    key: 'new_item',
    name: '',
    details: null,
    onClick: null,
    editable: true
  })

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><WorkspaceComponent breadcrumbsItems={breadcrumbsItems}/></MemoryRouter>)

  act(() => {
    store.dispatch({
      type: BreadcrumbsTypes.SET_BREADCRUMBS,
      payload: breadcrumbsItems.get(0)
    })
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error.description).toEqual(errorDescription)
  })
})

test('create new workspace from name success', async () => {
  const workspaceName = NEW_WORKSPACE_NAME
  const workspaceDescription = 'Description test'

  server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 'item-id-test-1', name: workspaceName, description: workspaceDescription }), ctx.delay(150))
  }))

  const breadcrumbsItems = new Map()
  breadcrumbsItems.set(0, {
    key: 'new_item',
    name: '',
    details: null,
    onClick: null,
    editable: true
  })

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><WorkspaceComponent breadcrumbsItems={breadcrumbsItems}/></MemoryRouter>)

  act(() => {
    store.dispatch({
      type: BreadcrumbsTypes.SET_BREADCRUMBS,
      payload: breadcrumbsItems.get(0)
    })
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
  })
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

  const { store } = renderWithProvideres(<MemoryRouter initialEntries={['']}><WorkspaceComponent breadcrumbsItems={breadcrumbsItems} /></MemoryRouter>)

  server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 'item-id-test-2', name: workspaceName, description: workspaceDescription }), ctx.delay(150))
  }))

  const descriptionComponent = screen.getByTestId('create-workspace-component-description')
  const saveButtonComponent = screen.getByTestId('create-workspace-component-save-button')

  fireEvent.change(descriptionComponent, { target: { value: workspaceDescription } })
  await fireEvent.click(saveButtonComponent)

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('new-workspace-component-header-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
  })
})
