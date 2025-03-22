import React from 'react'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import MainAuthenticatedRoute, { RIGHT_MENU_TEST_ID } from '../main-authenticated-route'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import { UserTypes } from '../../../store/reducers/users/reducer'
import User from '../../../models/user'
import { setupServer } from 'msw/lib/node'
import { rest } from 'msw'

const server = setupServer()

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

test('test opening workspace content', async () => {
  const breadcrumbTestId = DEFAULT_BREADCRUMBS_TEST_ID
  const newWorkspaceLinkTestId = 'workspace-empty-state-new-item-link'
  const workspaceLoadingTestId = 'workspace-list-progress'

  server.use(rest.get('http://localhost:5000/workspace', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]), ctx.delay(150))
  }))

  const { store } = renderWithProvideres(<BrowserRouter><MainAuthenticatedRoute /></BrowserRouter>)

  const mainContentTitle = screen.getByTestId(`${breadcrumbTestId}-text-link-0`)

  const mockCurrentUser: User = {
    id: 'user_id',
    name: 'user_name',
    login: 'login'
  }

  // this dispatch is required to fetch the workspaces
  act(() => {
    store.dispatch({
      type: UserTypes.SET_CURRENT_USER,
      payload: mockCurrentUser
    })
  })

  await waitFor(() => {
    expect(screen.queryByTestId(workspaceLoadingTestId)).toBeInTheDocument()
    expect(mainContentTitle).toHaveTextContent('Workspaces')
    expect(screen.queryByTestId('main-content-card')).toBeInTheDocument()
    expect(screen.queryByTestId('workspaces-container-component')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId(workspaceLoadingTestId)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId(newWorkspaceLinkTestId)).toBeInTheDocument()
  })
})

test('test logout', async () => {
  const rightMenuTestId = RIGHT_MENU_TEST_ID
  const logoutMenuTestId = `menu-item-${rightMenuTestId}-Sair`

  renderWithProvideres(
    <BrowserRouter>
      <MainAuthenticatedRoute />
    </BrowserRouter>
  )

  const rightMenuComponent = screen.getByTestId(rightMenuTestId)

  fireEvent.click(rightMenuComponent)

  await waitFor(() => {
    expect(screen.queryByTestId(logoutMenuTestId)).toBeInTheDocument()
  })

  const logoutMenuItem = screen.getByTestId(logoutMenuTestId)
  fireEvent.click(logoutMenuItem)

  expect(mockNavigate).toHaveBeenCalledWith('/login')
})
