import React, { FC, ReactElement } from 'react'
import { Container } from './style'

interface AnimatedContainerProps {
  children: ReactElement | ReactElement[] | null
  time?: number
}

const AnimatedContainer: FC<AnimatedContainerProps> = ({ children, time = 0.2, ...props }: AnimatedContainerProps) => {
  return (
    <Container time={time} {...props}>
      {children}
    </Container>
  )
}

export default AnimatedContainer
