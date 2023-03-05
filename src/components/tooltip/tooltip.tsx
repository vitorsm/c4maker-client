import React, { FC, ReactElement, useState } from 'react'
import { defaultColors } from '../../configs/colors'
import { TooltipText } from './style'

interface TooltipProps {
  text: string | null
  children: ReactElement
  color?: string
  textColor?: string
  dataTestId?: string
}

const Tooltip: FC<TooltipProps> = ({
  text, children, color = defaultColors.primary.main, textColor = 'white',
  dataTestId = 'tooltip-text-div'
}: TooltipProps) => {
  const [showDescription, setShowDescription] = useState(false)
  const [mouseOnComponents, setMouseOnComponents] = useState({ onTooltip: false, onText: false })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const timeToShowTooltip = 1000
  const timeToHideTooltip = 100

  const isShowDescription = (): boolean => mouseOnComponents.onTooltip || mouseOnComponents.onText

  const handleShowDescription = async (time = timeToShowTooltip): Promise<void> => {
    if (showDescription && isShowDescription()) {
      return
    }

    return await new Promise(() => {
      setTimeout(() => {
        setShowDescription(isShowDescription())
      }, time)
    })
  }

  const handleMouseOver = (event: any): void => {
    mouseOnComponents.onTooltip = true
    setMousePosition({ x: event.clientX, y: event.clientY })
    setMouseOnComponents(mouseOnComponents)
    void handleShowDescription()
  }

  const handleMouseOut = (): void => {
    mouseOnComponents.onTooltip = false
    setMouseOnComponents(mouseOnComponents)
    void handleShowDescription(timeToHideTooltip)
  }

  const handleMouseOverText = (): void => {
    mouseOnComponents.onText = true
    setMouseOnComponents(mouseOnComponents)
    void handleShowDescription()
  }

  const handleMouseOutText = (): void => {
    mouseOnComponents.onText = false
    setMouseOnComponents(mouseOnComponents)
    void handleShowDescription(timeToHideTooltip)
  }

  const renderTooltip = (): ReactElement | null => {
    if (!showDescription || text === null || text === '') {
      return null
    }

    return (
      <TooltipText
        data-testid={dataTestId}
        color={color}
        textColor={textColor}
        onMouseOver={handleMouseOverText}
        onMouseOut={handleMouseOutText}
        positionX={mousePosition.x}
        positionY={mousePosition.y}>
        { text }
      </TooltipText>
    )
  }

  return (
    <div onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      { children }
      { renderTooltip() }
    </div>
  )
}

export default Tooltip
