import React, { FC, RefObject, useEffect, useRef, useState } from 'react'
import { drawLineFromPositionToPosition, extractEventPosition, getClickedItem, handleSelectItem } from './utils'

export enum DrawType {
  IMG,
  LINE,
  REC,
  ARC
}

export interface Path2DData {
  path2D: Path2D
  originalWidth: number
  originalHeight: number
}

export interface DrawableItem {
  id: string
  type: DrawType
  img: HTMLImageElement | null
  position: Position
  isSelected: boolean
  drawItem: Function | null
  name: string
  details: string
  description: string
  color: string
}

export interface Position {
  x: number
  y: number
  width: number
  height: number
}

export interface CanvasContainerProps {
  drawableItems: DrawableItem[]
  canvasWidth: number
  canvasHeight: number
  parentComponentRef: RefObject<HTMLElement>
  onItemPositionChange: (item: DrawableItem, newPosition: Position) => void
  onItemSelectionChange: (items: DrawableItem[]) => void
  drawLineToMouse: boolean
}

const ITEMS_COLOR = '#0000FF'
const BACKGROUND_ITEM_COLOR = '#bdb7b7'
const SELECTED_ITEM_COLOR = '#b83d3d'
const SELECTED_LINE_SIZE = 4
const BACKGROUND_DISTANCE_BETWEEN_CIRCLE = 30
const BACKGROUND_SIZE_OF_CIRCLE = 3

const CanvasContainer: FC<CanvasContainerProps> = ({
  drawableItems, canvasWidth, canvasHeight, parentComponentRef, onItemPositionChange, onItemSelectionChange, drawLineToMouse
}: CanvasContainerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [itemsToDraw, setItemsToDraw] = useState<DrawableItem[]>([])
  const [diffClickPosition, setDiffClickPosition] = useState<Position>({ x: 0, y: 0, width: 0, height: 0 })
  const [isMouseDown, setMouseDown] = useState<boolean>(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [mousePosition, setMousePosition] = useState<Position | null>(null)

  useEffect(() => {
    render()
  }, [canvasWidth, canvasHeight, itemsToDraw, mousePosition, drawLineToMouse])

  useEffect(() => {
    setItemsToDraw(drawableItems)
  }, [drawableItems])

  const render = (): void => {
    const context = canvasRef.current?.getContext('2d')
    if (context === undefined || context === null) return

    drawBackground(context)
    drawItems(context)
  }

  const drawBackground = (context: CanvasRenderingContext2D): void => {
    if (canvasWidth === 0 || canvasHeight === 0) return

    context.clearRect(0, 0, canvasWidth, canvasHeight)
    context.fillStyle = BACKGROUND_ITEM_COLOR
    context.beginPath()

    for (let x = 0; x < canvasWidth; x += BACKGROUND_DISTANCE_BETWEEN_CIRCLE) {
      for (let y = 0; y < canvasHeight; y += BACKGROUND_DISTANCE_BETWEEN_CIRCLE) {
        context.rect(x, y, BACKGROUND_SIZE_OF_CIRCLE, BACKGROUND_SIZE_OF_CIRCLE)
      }
    }

    context.fill()
    context.closePath()
  }

  const drawItems = (context: CanvasRenderingContext2D): void => {
    context.fillStyle = ITEMS_COLOR

    itemsToDraw.forEach(item => {
      switch (item.type) {
        case DrawType.IMG:
          if (item.drawItem !== null) {
            context.fillStyle = item.color
            item.drawItem(context)
          } else if (item.img !== null) {
            const position = item.position
            context.fillStyle = item.color
            context.drawImage(item.img, position.x, position.y, position.width, position.height)
          }
          break
        default:
          console.error('invalid type')
      }
    })

    getSelectedItems().forEach(item => {
      const position = item.position

      context.beginPath()
      context.lineWidth = SELECTED_LINE_SIZE + 1
      context.strokeStyle = SELECTED_ITEM_COLOR
      context.rect(position.x - SELECTED_LINE_SIZE + 1, position.y - SELECTED_LINE_SIZE + 1, position.width + SELECTED_LINE_SIZE,
        position.height + SELECTED_LINE_SIZE)
      context.stroke()
      context.closePath()
    })

    if (drawLineToMouse) {
      drawLineFromPositionToPosition(context, selectedPosition, mousePosition)
    }
  }

  const getSelectedItems = (): DrawableItem[] => {
    return itemsToDraw.filter(item => item.isSelected)
  }

  const handleOnMouseDown = (event: any): void => {
    const position = extractEventPosition(event, parentComponentRef)
    const selectedItem = getClickedItem(position, itemsToDraw)

    if (selectedItem !== null) {
      setDiffClickPosition({
        x: position.x - selectedItem.position.x,
        y: position.y - selectedItem.position.y,
        width: 0,
        height: 0
      })
      setSelectedPosition(position)
    }

    const newItems = handleSelectItem(position, itemsToDraw)
    if (newItems !== null) {
      onItemSelectionChange([...newItems])
    }

    setMouseDown(true)
  }

  const handleOnMouseUp = (event: any): void => {
    setMouseDown(false)
    setDiffClickPosition({ x: 0, y: 0, width: 0, height: 0 })
  }

  const handleOnMouseMove = (event: any): void => {
    if (!isMouseDown && (selectedPosition === null || !drawLineToMouse)) return

    const position = extractEventPosition(event, parentComponentRef)

    if (drawLineToMouse) {
      setMousePosition(position)
    }

    if (!isMouseDown) return

    const selectedItem = itemsToDraw.find(item => item.isSelected)

    if (selectedItem === undefined) return

    const newPosition = { ...selectedItem.position }
    newPosition.x = position.x - diffClickPosition.x
    newPosition.y = position.y - diffClickPosition.y

    onItemPositionChange(selectedItem, newPosition)
  }

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onMouseMove={handleOnMouseMove}>
    </canvas>
  )
}

export default CanvasContainer
