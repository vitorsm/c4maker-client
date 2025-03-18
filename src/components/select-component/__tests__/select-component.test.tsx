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

test('test change select value', async () => {
  const dataTestId = 'select-id'
  const onChange = jest.fn()
  const secondItemValue = 'second-item-value'
  const items = [{ key: 'first-item', content: 'First Item' }, { key: secondItemValue, content: 'Second Item' }]

  render(<SelectComponent onChangeSelection={onChange} items={items} dataTestId={dataTestId} />)

  const selectComponent = screen.getByTestId(`${dataTestId ?? ''}-select`)

  expect(selectComponent).toHaveTextContent(items[0].content)

  fireEvent.change(selectComponent, { target: { value: secondItemValue } })

  await waitFor(() => {
    expect(selectComponent).toHaveTextContent(items[1].content)
  })

  expect(onChange).toBeCalledWith(secondItemValue)
})
