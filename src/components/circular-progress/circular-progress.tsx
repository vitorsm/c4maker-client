import React, { FC } from 'react'
import { Container, Circular } from './style'

interface CircularProgressProps {
  size?: number
  borderSize?: number | null
  color?: string
  borderColor?: string
  dataTestId?: string
}

const CircularProgress: FC<CircularProgressProps> = ({
  size = 50, borderSize = null, color = 'green', borderColor = 'black', dataTestId = 'circular-progress'
}: CircularProgressProps) => {
  const processedBorderSize = borderSize !== null ? borderSize : size * 0.05

  return (
    <Container>
        <Circular
          size={size}
          borderSize={processedBorderSize}
          color={color}
          borderColor={borderColor}
          data-testid={dataTestId}
        />
    </Container>
  )
}

export default CircularProgress
