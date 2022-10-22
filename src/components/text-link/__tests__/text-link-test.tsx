import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import TextLink from '../'

test('test link value and on click', () => {
  const value = 'Value link'
  const onClick = jest.fn()

  render(<TextLink text={value} onClick={onClick} />)
  const link = screen.getByTestId('text-link')
  fireEvent.click(link)

  expect(link).toHaveTextContent(value)
  expect(onClick).toBeCalledTimes(1)
})
