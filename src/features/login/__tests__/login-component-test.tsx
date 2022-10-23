import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import LoginScreen from '..'
import { renderWithProvideres } from '../../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'

test('test login component navigation', () => {
  renderWithProvideres(<BrowserRouter><LoginScreen /></BrowserRouter>)

  expect(screen.queryByTestId('create-new-user-title')).not.toBeInTheDocument()
  expect(screen.queryByTestId('credentials-icon-id')).toBeInTheDocument()

  const newUserLink = screen.getByTestId('text-link-create-new-user')

  fireEvent.click(newUserLink)

  expect(screen.queryByTestId('create-new-user-title')).toBeInTheDocument()
  expect(screen.queryByTestId('credentials-icon-id')).not.toBeInTheDocument()

  const backCreateNewUserBtn = screen.getByTestId('btn-back-create-new-user')

  fireEvent.click(backCreateNewUserBtn)

  expect(screen.queryByTestId('create-new-user-title')).not.toBeInTheDocument()
  expect(screen.queryByTestId('credentials-icon-id')).toBeInTheDocument()
})
