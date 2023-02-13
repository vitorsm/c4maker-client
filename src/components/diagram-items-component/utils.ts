import { Position } from '../canvas-container/models'

/***
 * Get a and b from line function ax + b = y
 */
const getABFromLine = (point1: Position, point2: Position): [number, number] => {
  const a = (point2.y - point1.y) / (point2.x - point1.x)
  const b = point1.y - point1.x * a

  return [a, b]
}

const pointIsInLine = (line: [Position, Position], point: Position): boolean => {
  const isXAscending = line[0].x < line[1].x
  const isYAscending = line[0].y < line[1].y

  const numberIsOutOfInterval = (point: number, interval1: number, interval2: number): boolean => {
    return point < interval1 || point > interval2
  }

  if (isXAscending) {
    if (numberIsOutOfInterval(point.x, line[0].x, line[1].x)) {
      return false
    }
  } else {
    if (numberIsOutOfInterval(point.x, line[1].x, line[0].x)) {
      return false
    }
  }

  if (isYAscending) {
    if (numberIsOutOfInterval(point.y, line[0].y, line[1].y)) {
      return false
    }
  } else {
    if (numberIsOutOfInterval(point.y, line[1].y, line[0].y)) {
      return false
    }
  }

  return true
}

export const getInterceptionPoint = (line1: [Position, Position], line2: [Position, Position]): Position | null => {
  const isVerticalLine = (line: [Position, Position]): boolean => {
    return line[0].x === line[1].x
  }

  const [line1A, line1B] = getABFromLine(...line1)
  const [line2A, line2B] = getABFromLine(...line2)

  let x1, y1

  if (isVerticalLine(line1)) {
    x1 = line1[0].x
    y1 = line2A * x1 + line2B
  } else {
    y1 = (line1A * line2B - line2A * line1B) / (line1A - line2A)
    x1 = (y1 - line1B) / line1A
  }

  const point = {
    x: x1,
    y: y1,
    width: 0,
    height: 0
  }

  if (isNaN(point.x) || isNaN(point.y)) {
    return null
  }

  return pointIsInLine(line1, point) && pointIsInLine(line2, point) ? point : null
}
