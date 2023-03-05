import React from 'react'
import { fireEvent, screen, render } from '@testing-library/react'
import SearchInput from '../search-input'

test('test render search input', () => {
  const dataTestId = 'search'
  const onChange = jest.fn()
  const placeholder = 'This is the placeholder'
  const changedText = 'New text'

  render(<SearchInput dataTestId={dataTestId} onChange={onChange} placeholder={placeholder} />)

  const input = screen.getByTestId(`${dataTestId}-text-input`)
  fireEvent.change(input, { target: { value: changedText } })

  expect(screen.queryByTestId(`${dataTestId}-info-button`)).not.toBeInTheDocument()
  expect(onChange).toBeCalledWith(changedText)
})

test('test render search input with info', () => {
  const dataTestId = 'search'
  const onClickInfo = jest.fn()

  render(<SearchInput dataTestId={dataTestId} onChange={jest.fn()} placeholder={'placeholder'} onClickInfo={onClickInfo} />)

  const infoButton = screen.getByTestId(`${dataTestId}-info-button`)
  fireEvent.click(infoButton)

  expect(screen.queryByTestId(`${dataTestId}-info-button`)).toBeInTheDocument()
  expect(onClickInfo).toBeCalledTimes(1)
})
