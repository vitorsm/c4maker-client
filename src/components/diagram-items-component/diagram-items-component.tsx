import React, { FC, useEffect, useRef, useState } from 'react'
import { DiagramItem, DiagramItemType } from '../../models/diagram'
import CanvasContainer, { DrawableItem, DrawType, Position } from '../canvas-container/canvas-container'
import { Container } from './style'

interface DiagramItemsComponentProps {
  diagramItems: DiagramItem[]
  onDiagramItemChange: (updatedDiagramItems: DiagramItem[]) => void
}

const CANVAS_WIDTH = 2246
const CANVAS_HEIGHT = 1324

const MAP_TYPES_TO_IMG = new Map()
MAP_TYPES_TO_IMG.set(DiagramItemType[DiagramItemType.PERSON], './background1.jpg')
MAP_TYPES_TO_IMG.set(DiagramItemType[DiagramItemType.SOFTWARE_SYSTEM], './background1.jpg')
MAP_TYPES_TO_IMG.set(DiagramItemType[DiagramItemType.CONTAINER], './background1.jpg')
MAP_TYPES_TO_IMG.set(DiagramItemType[DiagramItemType.COMPONENT], './background1.jpg')

const DiagramItemsComponent: FC<DiagramItemsComponentProps> = ({ diagramItems, onDiagramItemChange }: DiagramItemsComponentProps) => {
  const componentRef = useRef<HTMLElement>(null)
  const [drawableItems, setDrawableItems] = useState<DrawableItem[]>([])

  useEffect(() => {
    instantiateDrawItems()
  }, [diagramItems])

  // const getImageByDiagramType = (diagramType: string): any => {
  //   switch (diagramType) {
  //     case DiagramItemType[DiagramItemType.PERSON]:
  //       return {
  //         path2D: new Path2D('M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z'),
  //         originalWidth: 448,
  //         originalHeight: 512
  //       }
  //     default:
  //       return require('./background1.jpg')
  //   }
  // }

  const roundRect = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void => {
    const radius = 10
    const endX = x + width
    const endY = y + height

    context.moveTo(x + radius, y)
    context.lineTo(endX - radius, y)
    context.quadraticCurveTo(endX, y, endX, y + radius)
    context.lineTo(endX, endY - radius)
    context.quadraticCurveTo(endX, endY, endX - radius, endY)
    context.lineTo(x + radius, endY)
    context.quadraticCurveTo(x, endY, x, endY - radius)
    context.lineTo(x, y + radius)
    context.quadraticCurveTo(x, y, x + radius, y)
    // context.stroke()
    context.fill()
  }

  const generateUserComponent = (context: CanvasRenderingContext2D, position: Position): void => {
    const circleRadius = position.height * 0.25
    const circleX = position.x + position.width / 2
    const startBoxY = 0.8 * circleRadius * 2
    const boxHeight = position.height - circleRadius * 2

    context.beginPath()
    context.arc(circleX, position.y + circleRadius, circleRadius, 0, 2 * Math.PI)
    roundRect(context, position.x, position.y + startBoxY, position.width, boxHeight)
    context.closePath()
  }

  const generateContainerComponent = (context: CanvasRenderingContext2D, position: Position): void => {
    context.beginPath()
    roundRect(context, position.x, position.y, position.width, position.height)
    context.closePath()
  }

  const getPositionByDiagramItem = (diagramItem: DiagramItem): Position => {
    const position = { x: 10, y: 200, width: 200, height: 200 }

    if (diagramItem.position !== null) {
      position.x = diagramItem.position.x
      position.y = diagramItem.position.y
    }

    return position
  }

  const instantiateDrawItems = (): void => {
    const newItems = diagramItems.filter(diagramItem => diagramItem.id !== undefined).map(diagramItem => {
      // const diagramType = DiagramItemType[diagramItem.itemType]
      // const [x, y, width, height] = [10, 30, 200, 200]
      const position = getPositionByDiagramItem(diagramItem)
      const itemType = DiagramItemType[diagramItem.itemType]

      return {
        id: diagramItem.id !== undefined ? diagramItem.id : 'only to avoid error',
        type: DrawType.IMG,
        img: null,
        position,
        isSelected: diagramItem.isSelected !== undefined ? diagramItem.isSelected : false,
        name: diagramItem.name,
        description: diagramItem.itemDescription,
        details: diagramItem.details,
        drawItem: (context: CanvasRenderingContext2D) => {
          switch (itemType) {
            case DiagramItemType[DiagramItemType.PERSON]:
              return generateUserComponent(context, position)
            case DiagramItemType[DiagramItemType.CONTAINER]:
              return generateContainerComponent(context, position)
            default:
              return generateUserComponent(context, position)
          }
        }
      }
    })

    setDrawableItems(newItems)
  }

  const onItemPositionChange = (item: DrawableItem, newPosition: Position): void => {
    const diagramItem = diagramItems.find(d => d.id === item.id)

    if (diagramItem === undefined) {
      console.error('diagram item modified but not found')
      return
    }

    diagramItem.position = { x: newPosition.x, y: newPosition.y }
    diagramItem.isSelected = item.isSelected

    onDiagramItemChange([diagramItem])
  }

  const onItemSelectionChange = (items: DrawableItem[]): void => {
    const itemsMap = new Map()
    items.forEach(item => {
      itemsMap.set(item.id, item)
    })

    const newDiagramItems = diagramItems.map(diagramItem => {
      const drawableItem = itemsMap.get(diagramItem.id)
      diagramItem.isSelected = drawableItem.isSelected
      return diagramItem
    })

    onDiagramItemChange(newDiagramItems)
  }

  return (
    <Container ref={componentRef}>

      <CanvasContainer
        drawableItems={drawableItems}
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
        parentComponentRef={componentRef}
        onItemPositionChange={onItemPositionChange}
        onItemSelectionChange={onItemSelectionChange} />

    </Container>
  )
}

export default DiagramItemsComponent
