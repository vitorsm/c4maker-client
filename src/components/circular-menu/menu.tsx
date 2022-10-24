import React, { FC, ReactElement } from 'react'
import { MenuComponent, MenuItem } from './style'

export interface MenuItemObj {
  text: string
  onClick: Function
  disabled: boolean
}

interface MenuProps {
  menuSide: 'left' | 'right'
  setMouseOnMenu?: Function | null
  menuItems: MenuItemObj[]
  marginLeft?: number | null
}

const Menu: FC<MenuProps> = ({ menuSide, menuItems, marginLeft = null, setMouseOnMenu = null }: MenuProps) => {
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
      <MenuItem key={`menu-item-${item.text}-${index}`} onClick={item.onClick} disabled={item.disabled}>
        {item.text}
      </MenuItem>
    ))
  }

  return (
    <MenuComponent onMouseOver={mouseOver} onMouseOut={mouseOut} marginLeft={marginLeft}>
      {renderMenuItems()}
    </MenuComponent>
  )
}

export default Menu
