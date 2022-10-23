import React, { FC, ReactElement } from 'react'
import Tooltip from '../tooltip'
import { MenuContainer } from './style'

interface CircularMenuProps {
  description?: string | null
  icon: ReactElement
  size: number
}

const CircularMenu: FC<CircularMenuProps> = ({ icon, size, description = null }: CircularMenuProps) => {
  return (
    <Tooltip text='Menu'>
      <MenuContainer size={size}>
        { icon }
      </MenuContainer>
    </Tooltip>
  )
}

export default CircularMenu
