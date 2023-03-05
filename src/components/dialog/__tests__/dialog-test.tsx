import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Dialog from '../'

test('test dont show dialog', () => {
  const dataTestId = 'dialog-screen'
  render(<Dialog show={false} dataTestId={dataTestId}><div>Test</div></Dialog>)
  const dialogScreen = screen.getByTestId(dataTestId)
  expect(dialogScreen).toHaveStyle({ display: 'none' })
})

test('test show dialog', () => {
  const dataTestId = 'dialog-screen'
  render(<Dialog show={true} dataTestId={dataTestId}><div/></Dialog>)
  const dialogScreen = screen.getByTestId(dataTestId)

  expect(dialogScreen).toHaveStyle({ display: 'flex' })
})

test('test dont show cancel button', () => {
  const dataTestId = 'dialog-screen'
  render(<Dialog show={true} dataTestId={dataTestId}><div/></Dialog>)
  const cancelButton = screen.queryAllByTestId(`${dataTestId}-dialog-cancel-btn`)
  expect(cancelButton).toEqual([])
})

test('test handler click', () => {
  const dataTestId = 'dialog-screen'
  const onOkClick = jest.fn()
  const onCancelClick = jest.fn()

  render(<Dialog show={true} onOkClick={onOkClick} onCancelClick={onCancelClick} dataTestId={dataTestId}><div/></Dialog>)
  const okButton = screen.getByTestId(`${dataTestId}-dialog-ok-btn`)
  const cancelButton = screen.getByTestId(`${dataTestId}-dialog-cancel-btn`)
  fireEvent.click(okButton)
  fireEvent.click(cancelButton)

  expect(onOkClick).toBeCalledTimes(1)
  expect(onCancelClick).toBeCalledTimes(1)
})

test('test handler click without callback', () => {
  const dataTestId = 'dialog-screen'
  render(<Dialog show={true} dataTestId={dataTestId}><div/></Dialog>)
  const okButton = screen.getByTestId(`${dataTestId}-dialog-ok-btn`)
  fireEvent.click(okButton)
})
