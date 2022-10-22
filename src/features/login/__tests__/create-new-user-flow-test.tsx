import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import LoginScreen from '..'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test create new user with api error', async () => {
  const { store } = renderWithProvideres(<LoginScreen />)

  const errorDescription = 'Name is required'
  server.use(rest.post('http://localhost:5000/user', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ description: errorDescription }), ctx.delay(150))
  }))

  const name = 'Name'
  const login = 'Login'
  const password = 'Password'

  const createUserLink = screen.getByTestId('text-link-create-new-user')
  fireEvent.click(createUserLink)

  const nameInput = screen.getByTestId('create-new-user-name-input')
  const loginInput = screen.getByTestId('create-new-user-login-input')
  const passwordInput = screen.getByTestId('create-new-user-password-input')
  const createUserBtn = screen.getByTestId('create-new-user-btn')

  fireEvent.change(nameInput, { target: { value: name } })
  fireEvent.change(loginInput, { target: { value: login } })
  fireEvent.change(passwordInput, { target: { value: password } })

  fireEvent.click(createUserBtn)

  expect(screen.queryByTestId('create-new-user-progress')).toBeInTheDocument()
  expect(screen.queryByTestId('create-new-user-btn')).not.toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('create-new-user-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-new-user-btn')).toBeInTheDocument()
    expect(store.getState().errorReducer.error.description).toEqual('Name is required')
  })
})

test('test create new user - unfilled fields', () => {
  renderWithProvideres(<LoginScreen />)

  const createUserLink = screen.getByTestId('text-link-create-new-user')
  fireEvent.click(createUserLink)

  const createUserBtn = screen.getByTestId('create-new-user-btn')

  fireEvent.click(createUserBtn)

  expect(screen.queryByTestId('create-new-user-progress')).not.toBeInTheDocument()
  expect(screen.queryByTestId('create-new-user-btn')).toBeInTheDocument()
})

test('create new user', async () => {
  const { store } = renderWithProvideres(<LoginScreen />)

  const name = 'Name'
  const login = 'Login'
  const password = 'Password'
  const apiResult = { name, login, password }

  server.use(rest.post('http://localhost:5000/user', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(apiResult), ctx.delay(150))
  }))

  const createUserLink = screen.getByTestId('text-link-create-new-user')
  fireEvent.click(createUserLink)

  const nameInput = screen.getByTestId('create-new-user-name-input')
  const loginInput = screen.getByTestId('create-new-user-login-input')
  const passwordInput = screen.getByTestId('create-new-user-password-input')
  const createUserBtn = screen.getByTestId('create-new-user-btn')

  fireEvent.change(nameInput, { target: { value: name } })
  fireEvent.change(loginInput, { target: { value: login } })
  fireEvent.change(passwordInput, { target: { value: password } })

  fireEvent.click(createUserBtn)

  expect(screen.queryByTestId('create-new-user-progress')).toBeInTheDocument()
  expect(screen.queryByTestId('create-new-user-btn')).not.toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('create-new-user-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-new-user-btn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('login-enter-button')).toBeInTheDocument()

    expect(store.getState().errorReducer.error).toBeUndefined()
    expect(store.getState().userReducer.createdUser.data).toEqual(apiResult)
  })
})
