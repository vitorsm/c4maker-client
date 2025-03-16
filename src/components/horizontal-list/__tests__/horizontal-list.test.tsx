import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import HorizontalList from '../horizontal-list'

test('test horizontal list right click', async () => {
  const horizontalTestId = 'horizontal-list'
  const items = [
    <div key={1}>Item</div>
  ]

  const mockScrollToFunction = jest.fn()
  const initialLeftPosition = 10

  render(<HorizontalList items={items} dataTestId={horizontalTestId}/>)

  const rightButtonElement = screen.getByTestId(`${horizontalTestId}-right-button`)
  const horizontalListComponent = screen.getByTestId(horizontalTestId)

  Object.defineProperty(horizontalListComponent, 'clientWidth', { value: 1000, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollLeft', { value: initialLeftPosition, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollTo', { value: mockScrollToFunction, writable: true })

  fireEvent.click(rightButtonElement)

  expect(mockScrollToFunction).toBeCalledWith({ left: 110 })
})

test('test horizontal list left click', async () => {
  const horizontalTestId = 'horizontal-list'
  const items = [
    <div key={1}>Item</div>
  ]

  const mockScrollToFunction = jest.fn()
  const initialLeftPosition = 500

  render(<HorizontalList items={items} dataTestId={horizontalTestId}/>)

  const leftButtonElement = screen.getByTestId(`${horizontalTestId}-left-button`)
  const horizontalListComponent = screen.getByTestId(horizontalTestId)

  Object.defineProperty(horizontalListComponent, 'clientWidth', { value: 1000, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollLeft', { value: initialLeftPosition, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollTo', { value: mockScrollToFunction, writable: true })

  fireEvent.click(leftButtonElement)

  expect(mockScrollToFunction).toBeCalledWith({ left: 400 })
})

test('test horizontal list right click limit', async () => {
  const horizontalTestId = 'horizontal-list'
  const items = [
    <div key={1}>Item</div>
  ]

  const mockScrollToFunction = jest.fn()
  const initialLeftPosition = 950
  const maxLeftSize = 1000

  render(<HorizontalList items={items} dataTestId={horizontalTestId}/>)

  const rightButtonElement = screen.getByTestId(`${horizontalTestId}-right-button`)
  const horizontalListComponent = screen.getByTestId(horizontalTestId)

  Object.defineProperty(horizontalListComponent, 'clientWidth', { value: maxLeftSize, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollLeft', { value: initialLeftPosition, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollTo', { value: mockScrollToFunction, writable: true })

  fireEvent.click(rightButtonElement)

  expect(mockScrollToFunction).toBeCalledWith({ left: maxLeftSize })
})

test('test horizontal list left click limit', async () => {
  const horizontalTestId = 'horizontal-list'
  const items = [
    <div key={1}>Item</div>
  ]

  const mockScrollToFunction = jest.fn()
  const initialLeftPosition = 10

  render(<HorizontalList items={items} dataTestId={horizontalTestId}/>)

  const leftButtonElement = screen.getByTestId(`${horizontalTestId}-left-button`)
  const horizontalListComponent = screen.getByTestId(horizontalTestId)

  Object.defineProperty(horizontalListComponent, 'clientWidth', { value: 1000, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollLeft', { value: initialLeftPosition, writable: true })
  Object.defineProperty(horizontalListComponent, 'scrollTo', { value: mockScrollToFunction, writable: true })

  fireEvent.click(leftButtonElement)

  expect(mockScrollToFunction).toBeCalledWith({ left: 0 })
})
