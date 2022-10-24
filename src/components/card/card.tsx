import React, { FC, ReactElement } from 'react'
import { defaultColors } from '../../configs/colors'
import { Container, CardContainer, DescriptionContainer } from './style'

interface CardProps {
  description?: string | null
  children: ReactElement
  hoverColor?: string
  onClick?: Function | null
  dataTestId?: string
}

const Card: FC<CardProps> = ({ children, onClick = null, description = null, hoverColor = defaultColors.selected.main, dataTestId = 'card-component' }: CardProps) => {
  const onClickHandler = (): void => {
    if (onClick === null) {
      return
    }

    onClick()
  }
  const renderDescription = (): ReactElement | null => {
    if (description === null) {
      return null
    }

    return (
      <DescriptionContainer data-testid={`description-container-${dataTestId}`}>
        {description}
      </DescriptionContainer>
    )
  }

  return (
    <Container data-testid={dataTestId} onClick={onClickHandler}>
      <CardContainer hoverColor={hoverColor}>
        {children}
      </CardContainer>

      {renderDescription()}
    </Container>
  )
}

export default Card
