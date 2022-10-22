import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TextInput from '../'

test('test default value', () => {
  const value = 'content value'
  render(<TextInput title={'title'} value={value} />)
  const input = screen.getByTestId('text-input')

  expect(input.getAttribute('value')).toEqual(value)
})

test('test on change value', () => {
  const onChangeFunction = jest.fn()
  const newValue = 'newValue'

  render(<TextInput title={'title'} onChange={onChangeFunction} />)
  const input = screen.getByTestId('text-input')
  fireEvent.change(input, { target: { value: newValue } })

  expect(onChangeFunction).lastCalledWith(newValue)
  expect(input.getAttribute('value')).toEqual(newValue)
})

test('test on change value without callback', () => {
  const newValue = 'newValue'

  render(<TextInput title={'title'} />)
  const input = screen.getByTestId('text-input')
  fireEvent.change(input, { target: { value: newValue } })

  expect(input.getAttribute('value')).toEqual(newValue)
})
