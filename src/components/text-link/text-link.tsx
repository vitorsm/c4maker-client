import React, { FC } from 'react'
import { Container } from './style'

interface TextLinkProps {
  text: string
  onClick: any
  color?: string
  dataTestId?: string | undefined
}

const TextLink: FC<TextLinkProps> = ({ text, onClick, color = 'blue', dataTestId = 'text-link' }: TextLinkProps) => {
  return (
    <Container data-testid={dataTestId} onClick={onClick} style={{ cursor: 'pointer', textDecoration: 'underline', color }}>
      {text}
    </Container>
  )
}

export default TextLink
