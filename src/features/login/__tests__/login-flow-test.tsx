import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import LoginScreen from '..'
import { renderWithProvideres } from '../../../utils/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BrowserRouter } from 'react-router-dom'

export const handlers = [
  rest.post('http://localhost:5000/api/auth/authenticate', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ description: 'Invalid credentials' }), ctx.delay(150))
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test login flow with error', async () => {
  const { store } = renderWithProvideres(<BrowserRouter><LoginScreen /></BrowserRouter>)

  const login = 'login-test'

  const loginInput = screen.getByTestId('login-input')
  const passwordInput = screen.getByTestId('login-password-input')
  const enterButton = screen.getByTestId('login-enter-button')

  fireEvent.change(loginInput, { target: { value: login } })
  fireEvent.change(passwordInput, { target: { value: login } })

  expect(screen.queryByTestId('login-circular-progress')).not.toBeInTheDocument()
  expect(screen.queryByTestId('login-enter-button')).toBeInTheDocument()

  fireEvent.click(enterButton)

  expect(screen.queryByTestId('login-circular-progress')).toBeInTheDocument()
  expect(screen.queryByTestId('login-enter-button')).not.toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('login-circular-progress')).toBeInTheDocument()
    expect(screen.queryByTestId('login-enter-button')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(store.getState().errorReducer.error.description).toEqual('Invalid credentials')
    expect(store.getState().userReducer.tokenData.data).toBeNull()
  })
})

test('test login flow without error', async () => {
  const { store } = renderWithProvideres(<BrowserRouter><LoginScreen /></BrowserRouter>)

  const token = 'TOKEN'
  server.use(rest.post('http://localhost:5000/api/auth/authenticate', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ access_token: token }), ctx.delay(150))
  }))

  const login = 'login-test'

  const loginInput = screen.getByTestId('login-input')
  const passwordInput = screen.getByTestId('login-password-input')
  const enterButton = screen.getByTestId('login-enter-button')

  fireEvent.change(loginInput, { target: { value: login } })
  fireEvent.change(passwordInput, { target: { value: login } })

  expect(screen.queryByTestId('login-circular-progress')).not.toBeInTheDocument()
  expect(screen.queryByTestId('login-enter-button')).toBeInTheDocument()

  fireEvent.click(enterButton)

  expect(screen.queryByTestId('login-circular-progress')).toBeInTheDocument()
  expect(screen.queryByTestId('login-enter-button')).not.toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('login-circular-progress')).toBeInTheDocument()
    expect(screen.queryByTestId('login-enter-button')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(store.getState().errorReducer.error).toBeUndefined()
    expect(store.getState().userReducer.tokenData.data.access_token).toEqual('TOKEN')
  })
})

test('test without filled inputs', () => {
  renderWithProvideres(<BrowserRouter><LoginScreen /></BrowserRouter>)

  const enterButton = screen.getByTestId('login-enter-button')
  fireEvent.click(enterButton)

  expect(screen.queryByTestId('login-circular-progress')).not.toBeInTheDocument()
  expect(screen.queryByTestId('login-enter-button')).toBeInTheDocument()
})
