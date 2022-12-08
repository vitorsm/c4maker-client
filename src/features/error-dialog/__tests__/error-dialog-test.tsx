import React from 'react'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import ErrorDialog from '../'
import { ErrorTypes } from '../../../store/reducers/errors/types'

test('test open and close modal', async () => {
  const { store } = renderWithProvideres(<ErrorDialog />)

  const errorName = 'Error name'
  const errorDescription = 'Error description'

  expect(screen.queryByTestId('error-dialog')).toHaveStyle({ display: 'none' })

  act(() => {
    store.dispatch({ type: ErrorTypes.SET_ERROR, payload: { name: errorName, description: errorDescription } })
  })

  await waitFor(() => {
    expect(screen.queryByTestId('error-dialog')).not.toHaveStyle({ display: 'none' })
    expect(screen.getByTestId('error-dialog-message-container')).toHaveTextContent(errorDescription)
  })

  const okBtn = screen.getByTestId('dialog-ok-btn')
  fireEvent.click(okBtn)

  await waitFor(() => {
    expect(screen.queryByTestId('error-dialog')).toHaveStyle({ display: 'none' })
    expect(screen.getByTestId('error-dialog-message-container')).toHaveTextContent(errorDescription)
  })
})
