import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC } from 'react'
import { Container } from './style'

interface FontAwesomeIconButtonProps {
  icon: IconDefinition
  size?: SizeProp
  onClick: Function
  dataTestId?: string | undefined
  border?: boolean
}

const FontAwesomeIconButton: FC<FontAwesomeIconButtonProps> = ({ icon, size, onClick, dataTestId, border }: FontAwesomeIconButtonProps) => {
  return (
    <Container onClick={onClick} data-testid={dataTestId} border={border}>
      <FontAwesomeIcon icon={icon} size={size} />
    </Container>
  )
}

export default FontAwesomeIconButton
