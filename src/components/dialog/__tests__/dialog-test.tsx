import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Dialog from '../dialog'

test('test dont show dialog', () => {
  render(<Dialog show={false}><div>Test</div></Dialog>)
  const dialogScreen = screen.getByTestId('dialog-screen')
  expect(dialogScreen).toHaveStyle({ display: 'none' })
})

test('test show dialog', () => {
  render(<Dialog show={true}><div/></Dialog>)
  const dialogScreen = screen.getByTestId('dialog-screen')

  expect(dialogScreen).toHaveStyle({ display: 'flex' })
})

test('test dont show cancel button', () => {
  render(<Dialog show={true}><div/></Dialog>)
  const cancelButton = screen.queryAllByTestId('dialog-cancel-btn')
  expect(cancelButton).toEqual([])
})

test('test handler click', () => {
  const onOkClick = jest.fn()
  const onCancelClick = jest.fn()

  render(<Dialog show={true} onOkClick={onOkClick} onCancelClick={onCancelClick}><div/></Dialog>)
  const okButton = screen.getByTestId('dialog-ok-btn')
  const cancelButton = screen.getByTestId('dialog-cancel-btn')
  fireEvent.click(okButton)
  fireEvent.click(cancelButton)

  expect(onOkClick).toBeCalledTimes(1)
  expect(onCancelClick).toBeCalledTimes(1)
})

test('test handler click without callback', () => {
  render(<Dialog show={true}><div/></Dialog>)
  const okButton = screen.getByTestId('dialog-ok-btn')
  fireEvent.click(okButton)
})
