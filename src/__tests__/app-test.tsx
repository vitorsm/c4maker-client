import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProvideres } from '../utils/test-utils'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'

test('test deafult app page', () => {
  renderWithProvideres(<BrowserRouter><App /></BrowserRouter>)

  expect(screen.queryByTestId('credentials-icon-id')).toBeInTheDocument()
})
