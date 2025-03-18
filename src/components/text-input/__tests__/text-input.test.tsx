import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import TextInput from '../'

test('test default value', () => {
  const value = 'content value'
  render(<TextInput title={'title'} value={value} />)
  const input = screen.getByTestId('text-input')

  expect(input.getAttribute('value')).toEqual(value)
  expect(input).toBeInstanceOf(HTMLInputElement)
})

test('test default value without edit', () => {
  const value = 'content value'
  render(<TextInput title={'title'} value={value} edit={false}/>)
  const input = screen.getByTestId('text-input')

  expect(input).toHaveTextContent(value)
  expect(input).toBeInstanceOf(HTMLDivElement)
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

test('test placeholder behavior input', async () => {
  const value = ''
  const placeholder = 'place holder text'

  render(<TextInput title={'title'} value={value} placeholder={placeholder} />)
  const input = screen.getByTestId('text-input')

  expect(input.getAttribute('value')).toEqual(placeholder)

  act(() => {
    input.focus()
  })

  await waitFor(() => {
    expect(input.getAttribute('value')).toEqual('')
  })

  act(() => {
    input.blur()
  })

  await waitFor(() => {
    expect(input.getAttribute('value')).toEqual(placeholder)
  })
})

test('test text-area type', async () => {
  const value = 'content value'
  render(<TextInput title={'title'} value={value} type='text-area'/>)
  const input = screen.getByTestId('text-input')

  expect(input).toHaveValue(value)
  expect(input).toBeInstanceOf(HTMLTextAreaElement)
})

test('test placeholder behavior text-area', async () => {
  const value = ''
  const placeholder = 'place holder text'

  render(<TextInput title={'title'} value={value} placeholder={placeholder} type='text-area'/>)
  const input = screen.getByTestId('text-input')

  expect(input).toHaveValue(placeholder)

  act(() => {
    input.focus()
  })

  await waitFor(() => {
    expect(input).toHaveValue('')
  })

  act(() => {
    input.blur()
  })

  await waitFor(() => {
    expect(input).toHaveValue(placeholder)
  })
})
