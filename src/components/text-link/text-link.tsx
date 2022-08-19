import React, { FC } from 'react'
import { Container } from './style'

interface TextLinkProps {
  text: string
  onClick: any
  color?: string
}

const TextLink: FC<TextLinkProps> = ({ text, onClick, color = 'blue' }: TextLinkProps) => {
  return (
    <Container onClick={onClick} style={{ cursor: 'pointer', textDecoration: 'underline', color }}>
      {text}
    </Container>
  )
}

export default TextLink
