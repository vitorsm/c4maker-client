import React, { FC } from 'react'
import { Container } from './style'

interface TextLinkProps {
  children: string
  onClick: Function | null
  color?: string
  dataTestId?: string | undefined
}

const TextLink: FC<TextLinkProps> = ({ children, onClick, color = 'blue', dataTestId = 'text-link' }: TextLinkProps) => {
  const internalOnClick = (): void => {
    if (onClick === null) {
      return
    }

    onClick()
  }

  return (
    <Container data-testid={dataTestId} onClick={internalOnClick} style={{ cursor: 'pointer', textDecoration: 'underline', color }}>
      {children}
    </Container>
  )
}

export default TextLink
