import React from 'react'
import { screen, fireEvent, render, waitFor } from '@testing-library/react'
import CircularMenu from '../'

test('test open menu', async () => {
  const menuItems = [{
    text: 'Menu 1',
    onClick: () => {},
    disabled: false
  }, {
    text: 'Menu 2',
    onClick: () => {},
    disabled: false
  }]

  const menuDataTestId = 'circular-menu-container'
  render(<CircularMenu menuItems={menuItems} size={50} icon={<div>icon</div>} dataTestId={menuDataTestId} />)

  expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[0].text}`)).not.toBeInTheDocument()

  const menu = screen.getByTestId(menuDataTestId)

  await fireEvent.click(menu)

  expect(screen.queryByTestId(menuDataTestId)).toBeInTheDocument()
  expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[0].text}`)).toBeInTheDocument()
  expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[1].text}`)).toBeInTheDocument()

  await fireEvent.mouseOver(menu)
  await fireEvent.mouseOut(menu)

  await waitFor(() => {
    expect(screen.queryByTestId(menuDataTestId)).toBeInTheDocument()
    expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[0].text}`)).not.toBeInTheDocument()
    expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[1].text}`)).not.toBeInTheDocument()
  })

  await fireEvent.click(menu)

  expect(screen.queryByTestId(menuDataTestId)).toBeInTheDocument()
  expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[0].text}`)).toBeInTheDocument()
  expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[1].text}`)).toBeInTheDocument()

  const menuComponent = screen.getByTestId(`menu-component-${menuDataTestId}`)

  await fireEvent.mouseOver(menuComponent)
  await fireEvent.mouseOut(menuComponent)

  await waitFor(() => {
    expect(screen.queryByTestId(menuDataTestId)).toBeInTheDocument()
    expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[0].text}`)).not.toBeInTheDocument()
    expect(screen.queryByTestId(`menu-item-${menuDataTestId}-${menuItems[1].text}`)).not.toBeInTheDocument()
  })
})

test('test click menu', async () => {
  const func1 = jest.fn()
  const func2 = jest.fn()

  const menuItems = [{
    text: 'Menu 1',
    onClick: func1,
    disabled: false
  }, {
    text: 'Menu 2',
    onClick: func2,
    disabled: false
  }]

  const menuDataTestId = 'circular-menu-container'
  render(<CircularMenu menuItems={menuItems} size={50} icon={<div>icon</div>} dataTestId={menuDataTestId} />)

  const menu = screen.getByTestId(menuDataTestId)

  await fireEvent.click(menu)

  const dataTestIdMenu1 = `menu-item-${menuDataTestId}-${menuItems[0].text}`
  const menu1 = screen.getByTestId(dataTestIdMenu1)

  await fireEvent.click(menu1)

  expect(func1).toBeCalledTimes(1)
  expect(func2).toBeCalledTimes(0)
})
