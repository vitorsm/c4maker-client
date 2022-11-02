import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithProvideres } from '../utils/test-utils'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'
import { setToken } from '../store/token_utils'

test('test deafult app page - with token', () => {
  setToken('TOKEN')
  const currentUser = {
    id: 'id',
    name: 'name',
    login: 'login'
  }
  const currentUserToDispatch = { data: currentUser, error: false, errorMessage: null }
  const preloadedState = {
    userReducer: { tokenData: undefined, currentUser: currentUserToDispatch },
    errorReducer: { error: undefined }
  }

  renderWithProvideres(<BrowserRouter><App /></BrowserRouter>, { preloadedState })

  expect(screen.queryByTestId('credentials-icon-id')).not.toBeInTheDocument()
  expect(screen.queryByTestId('main-authenticated-route-component')).toBeInTheDocument()
})

test('test deafult app page - without token', () => {
  setToken(null)
  renderWithProvideres(<BrowserRouter><App /></BrowserRouter>)
  expect(screen.queryByTestId('credentials-icon-id')).toBeInTheDocument()
})
