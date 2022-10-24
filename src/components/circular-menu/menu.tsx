import React, { FC, ReactElement } from 'react'
import { MenuComponent, MenuItem } from './style'

export interface MenuItemObj {
  text: string
  onClick: Function
  disabled: boolean
}

interface MenuProps {
  setMouseOnMenu?: Function | null
  menuItems: MenuItemObj[]
  marginLeft?: number | null
  dataTestId?: string
}

const Menu: FC<MenuProps> = ({ menuItems, marginLeft = null, setMouseOnMenu = null, dataTestId = 'circular-menu-items' }: MenuProps) => {
  const mouseOver = (): void => {
    if (setMouseOnMenu !== null) {
      setMouseOnMenu(true)
    }
  }

  const mouseOut = (): void => {
    if (setMouseOnMenu !== null) {
      setMouseOnMenu(false)
    }
  }

  const renderMenuItems = (): ReactElement[] => {
    return menuItems.map((item, index) => (
      <MenuItem data-testid={`menu-item-${dataTestId}-${item.text}`} key={`menu-item-${item.text}-${index}`} onClick={item.onClick} disabled={item.disabled}>
        {item.text}
      </MenuItem>
    ))
  }

  return (
    <MenuComponent onMouseOver={mouseOver} onMouseOut={mouseOut} marginLeft={marginLeft} data-testid={`menu-component-${dataTestId}`}>
      {renderMenuItems()}
    </MenuComponent>
  )
}

export default Menu
