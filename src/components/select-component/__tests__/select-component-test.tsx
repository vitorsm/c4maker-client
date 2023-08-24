import React from 'react'
import { screen, fireEvent, render, waitFor } from '@testing-library/react'
import SelectComponent from '../select-component'

test('test render select-component', () => {
  const dataTestId = 'select-id'
  const onChange = jest.fn()
  const items = [{ key: 'first-item', content: 'First Item' }, { key: 'second-item', content: 'Second Item' }]

  render(<SelectComponent onChangeSelection={onChange} items={items} selectedKey={items[1].key} dataTestId={dataTestId} />)

  const selectComponent = screen.getByTestId(`${dataTestId ?? ''}-select`)
  expect(selectComponent).toHaveTextContent(items[1].content)
})

test('test select-component checking open select', async () => {
  const dataTestId = 'select-id'
  const onChange = jest.fn()
  const items = [{ key: 'first-item', content: 'First Item' }, { key: 'second-item', content: 'Second Item' }]

  render(<SelectComponent onChangeSelection={onChange} items={items} selectedKey={items[1].key} dataTestId={dataTestId} />)

  const selectComponent = screen.getByTestId(`${dataTestId ?? ''}-select`)
  expect(selectComponent).toHaveTextContent(items[1].content)

  fireEvent.click(selectComponent)
  await waitFor(() => {
    expect(screen.queryByTestId(`${dataTestId ?? ''}-option-0`)).toBeInTheDocument()
  })
})
