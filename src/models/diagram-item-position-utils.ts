import { getNumber } from '../utils/typing-utils'
import { DiagramItemPosition } from './diagram'

export const getEndX = (position: DiagramItemPosition): number => {
  return position.x + position.width
}

export const getEndY = (position: DiagramItemPosition): number => {
  return position.y + position.height
}

export const getPosition = (position: DiagramItemPosition | null | undefined): DiagramItemPosition => {
  return {
    x: getNumber(position?.x),
    y: getNumber(position?.y),
    width: getNumber(position?.width),
    height: getNumber(position?.height)
  }
}
