import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import MainAuthenticatedRoute from '../main-authenticated-route'

test('test opening main authenticated menus', () => {
  renderWithProvideres(<BrowserRouter><MainAuthenticatedRoute /></BrowserRouter>)

  const mainContentTitle = screen.getByTestId('main-content-title')

  expect(mainContentTitle).toHaveTextContent('Diagrams')
  expect(screen.queryByTestId('main-content-card')).toBeInTheDocument()
  expect(screen.queryByTestId('diagrams-container-component')).toBeInTheDocument()
})

test('test opening diagrams content', () => {
  renderWithProvideres(<BrowserRouter><MainAuthenticatedRoute /></BrowserRouter>)
})
