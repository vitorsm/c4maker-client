import React, { FC } from 'react'
import { Container } from './style'

interface PlainButtonProps {
  text: string
  textColor?: string | undefined
  color?: string | undefined
  onClick?: Function | undefined
  disabled?: boolean | undefined
  fillWidth?: boolean | undefined
}

const PlainButton: FC<PlainButtonProps> = ({ text, textColor = 'black', color = 'white', onClick, disabled = false, fillWidth = false }: PlainButtonProps) => {
  const onClickHandler = (): void => {
    if (onClick !== undefined && onClick != null && !disabled) {
      onClick()
    }
  }

  return (
    <Container textColor={textColor} color={color} onClick={onClickHandler} disabled={disabled} fillWidth={fillWidth}>
      {text}
    </Container>
  )
}

export default PlainButton
