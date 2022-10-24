import React, { FC, ReactElement, useState } from 'react'
import { defaultColors } from '../../configs/colors'
import Tooltip from '../tooltip'
import Menu, { MenuItemObj } from './menu'
import { MenuContainer } from './style'

interface CircularMenuProps {
  description?: string
  icon: ReactElement
  size: number
  color?: string
  hoverColor?: string
  menuItems: MenuItemObj[]
  marginLeft?: number | null
  dataTestId?: string
}

const CircularMenu: FC<CircularMenuProps> = ({
  icon, size, menuItems, description = '', color = 'white', marginLeft = null,
  hoverColor = defaultColors.selected.main, dataTestId = 'circular-menu-container'
}: CircularMenuProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const [mouseOn, setMouseOn] = useState({ icon: false, menu: false })
  const timeToClose = 500

  const closeMenu = async (): Promise<void> => {
    return await new Promise(() => {
      setTimeout(() => {
        if (mouseOn.icon || mouseOn.menu) {
          return
        }

        setShowMenu(false)
      }, timeToClose)
    })
  }

  const onClickHandler = (): void => {
    setShowMenu(true)
  }

  const onMouseOverHandler = async (): Promise<void> => {
    mouseOn.icon = true
    await setMouseOn(mouseOn)
  }

  const onMouseOutHandler = async (): Promise<void> => {
    mouseOn.icon = false
    await setMouseOn(mouseOn)
    void closeMenu()
  }

  const onMenuOverOut = async (mouseMenuOn: boolean): Promise<void> => {
    mouseOn.menu = mouseMenuOn
    await setMouseOn(mouseOn)
    void closeMenu()
  }

  const renderMenu = (): ReactElement | null => {
    if (!showMenu) {
      return null
    }

    return (<Menu menuItems={menuItems} setMouseOnMenu={onMenuOverOut} marginLeft={marginLeft} dataTestId={dataTestId} />)
  }
  return (
    <>
      <Tooltip text={description}>
        <MenuContainer data-testid={dataTestId} size={size} color={color} hoverColor={hoverColor} onClick={onClickHandler}
         onMouseOver={onMouseOverHandler} onMouseOut={onMouseOutHandler}>
          { icon }
        </MenuContainer>
      </Tooltip>

      {renderMenu()}
    </>
  )
}

export default CircularMenu
