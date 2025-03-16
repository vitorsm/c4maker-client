import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PlainButton from '../'

test('test on click button without callback', () => {
  const buttonText = 'btn'
  render(<PlainButton text={buttonText} />)
  const button = screen.getByTestId('plain-btn')
  fireEvent.click(button)

  expect(button).toHaveTextContent(buttonText)
})

test('test on click with callback', () => {
  const onClick = jest.fn()
  render(<PlainButton text='text' onClick={onClick} />)
  const button = screen.getByTestId('plain-btn')
  fireEvent.click(button)

  expect(onClick).toBeCalledTimes(1)
})

test('test on click disabled false', () => {
  const onClick = jest.fn()
  render(<PlainButton text='text' onClick={onClick} disabled={true} />)
  const button = screen.getByTestId('plain-btn')
  fireEvent.click(button)

  expect(onClick).toBeCalledTimes(0)
})
