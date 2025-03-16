import React from 'react'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import Breadcrumbs, { BreadcrumbsItem } from '../breadcrumbs'

const mockBreadcrumbsItems = (firstItemFunction?: Function): BreadcrumbsItem[] => {
  return [{
    key: 'item_1',
    name: 'Item 1',
    details: null,
    onClick: firstItemFunction ?? null
  }, {
    key: 'item_2',
    name: 'Item 2',
    details: null,
    onClick: null
  }]
}

test('test render breadcrumbs without edit button', () => {
  const dataTestId = 'data-test-id'
  const item1Function = jest.fn()

  const breadcrumbsItems = mockBreadcrumbsItems(item1Function)

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

  const breadcrumbsItems = mockBreadcrumbsItems()
  breadcrumbsItems[1].editable = true

  const onLastItemChange = jest.fn()

  render(<Breadcrumbs items={breadcrumbsItems} onLastItemChange={onLastItemChange} dataTestId={dataTestId} />)

  const editItemButton = screen.getByTestId(`${dataTestId ?? ''}-edit-button`)

  fireEvent.click(editItemButton)

  await waitFor(() => {
    expect(screen.queryByTestId(`${dataTestId ?? ''}-confirm-button`)).toBeInTheDocument()
  })

  const confirmEditButton = screen.getByTestId(`${dataTestId ?? ''}-confirm-button`)

  fireEvent.click(confirmEditButton)

  await waitFor(() => {
    expect(onLastItemChange).toBeCalledWith(breadcrumbsItems[1])
  })
})

test('test edit breadcrumb and cancel', async () => {
  const dataTestId = 'data-test-id'

  const breadcrumbsItems = mockBreadcrumbsItems()
  breadcrumbsItems[1].editable = true

  const onLastItemChange = jest.fn()

  render(<Breadcrumbs items={breadcrumbsItems} onLastItemChange={onLastItemChange} dataTestId={dataTestId} />)

  const editItemButton = screen.getByTestId(`${dataTestId ?? ''}-edit-button`)

  fireEvent.click(editItemButton)

  await waitFor(() => {
    expect(screen.queryByTestId(`${dataTestId ?? ''}-cancel-button`)).toBeInTheDocument()
  })

  const cancelEditButton = screen.getByTestId(`${dataTestId ?? ''}-cancel-button`)

  fireEvent.click(cancelEditButton)

  expect(onLastItemChange).not.toBeCalled()
})
