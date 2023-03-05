import React from 'react'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import Breadcrumbs from '../breadcrumbs'

test('test render breadcrumbs without edit button', () => {
  const dataTestId = 'data-test-id'
  const item1Function = jest.fn()

  const breadcrumbsItems = [{
    key: 'item_1',
    name: 'Item 1',
    details: null,
    onClick: item1Function
  }, {
    key: 'item_2',
    name: 'Item 2',
    details: null,
    onClick: null
  }]

  const onLastItemChange = jest.fn()

  render(<Breadcrumbs items={breadcrumbsItems} onLastItemChange={onLastItemChange} dataTestId={dataTestId} />)

  const item1Component = screen.getByTestId(`${dataTestId}-text-link-0`)
  const item2Component = screen.getByTestId(`${dataTestId}-text-link-1`)

  fireEvent.click(item1Component)

  expect(item1Component).toHaveTextContent(breadcrumbsItems[0].name)
  expect(item2Component).toHaveTextContent(breadcrumbsItems[1].name)
  expect(screen.queryByTestId(`${dataTestId ?? ''}-edit-button`)).not.toBeInTheDocument()
  expect(item1Function).toBeCalledTimes(1)
})

test('test render breadcrumbs with edit button', async () => {
  const dataTestId = 'data-test-id'

  const breadcrumbsItems = [{
    key: 'item_1',
    name: 'Item 1',
    details: null,
    onClick: null
  }, {
    key: 'item_2',
    name: 'Item 2',
    details: null,
    onClick: null
  }]

  const onLastItemChange = jest.fn()

  render(<Breadcrumbs items={breadcrumbsItems} onLastItemChange={onLastItemChange} dataTestId={dataTestId} />)

  const editItemButton = screen.getByTestId(`${dataTestId ?? ''}-edit-button`)

  await fireEvent.click(editItemButton)

  await waitFor(() => {
    expect(screen.queryByTestId(`${dataTestId ?? ''}-confirm-button`)).toBeInTheDocument()
  })

  expect(onLastItemChange).toBeCalledWith(breadcrumbsItems[1])
})
