import React from 'react'
import { render, screen } from '@testing-library/react'
import CircularProgress from '../circular-progress'

test('test processed border size', () => {
  const size = 100
  const borderSize = '5px'

  render(<CircularProgress size={size} />)
  const circularProgress = screen.getByTestId('circular-progress')

  expect(circularProgress).toHaveStyle({ 'border-top-width': borderSize })
})

test('test all parameters', () => {
  const size = 100
  const borderSize = 20
  const color = 'white'
  const borderColor = 'blue'

  const sizeTxt = `${size}px`
  const borderSizeTxt = `${borderSize}px`

  render(<CircularProgress size={size} borderSize={borderSize} color={color} borderColor={borderColor} />)
  const circularProgress = screen.getByTestId('circular-progress')

  expect(circularProgress).toHaveStyle({
    'border-top-width': borderSizeTxt,
    width: sizeTxt,
    height: sizeTxt,
    'border-color': borderColor
  })
})
