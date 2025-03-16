import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { BrowserRouter } from 'react-router-dom'
import MainAuthenticatedRoute from '../main-authenticated-route'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'

test('test opening main authenticated menus', () => {
  renderWithProvideres(<BrowserRouter><MainAuthenticatedRoute /></BrowserRouter>)
  const breadcrumbTestId = DEFAULT_BREADCRUMBS_TEST_ID
  const mainContentTitle = screen.getByTestId(`${breadcrumbTestId}-text-link-0`)

  expect(mainContentTitle).toHaveTextContent('Workspaces')
  expect(screen.queryByTestId('main-content-card')).toBeInTheDocument()
  expect(screen.queryByTestId('workspaces-container-component')).toBeInTheDocument()
})

test('test opening workspace content', () => {
  renderWithProvideres(<BrowserRouter><MainAuthenticatedRoute /></BrowserRouter>)
})
