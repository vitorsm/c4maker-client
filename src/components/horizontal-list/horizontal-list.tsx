import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import React, { FC, ReactElement, useRef } from 'react'
import FontAwesomeIconButton from '../font-awesome-icon-button/font-awesome-icon-button'
import { Container, IconContainer, ItemsContainer } from './style'

const SCROLL_INCREMENT = 100

interface HorizontalListProps {
  items: ReactElement[] | HTMLElement[]
  dataTestId?: string
}

const DEFAULT_TEST_ID = 'horizontal-list-default'

const HorizontalList: FC<HorizontalListProps> = ({ items, dataTestId = DEFAULT_TEST_ID }: HorizontalListProps) => {
  const itemsContainerRef = useRef<HTMLDivElement | null>(null)

  const onClickScrollPositionButton = (isLeft: boolean): void => {
    if (itemsContainerRef.current === null) {
      return
    }

    const position = itemsContainerRef.current.scrollLeft
    let newPosition = isLeft ? position - SCROLL_INCREMENT : position + SCROLL_INCREMENT

    if (newPosition < 0) {
      newPosition = 0
    }

    if (newPosition > itemsContainerRef.current.clientWidth) {
      newPosition = itemsContainerRef.current.clientWidth
    }

    itemsContainerRef.current.scrollTo({ left: newPosition })
  }

  return (
    <Container>
      <IconContainer>
        <FontAwesomeIconButton icon={faChevronLeft} onClick={() => onClickScrollPositionButton(true)} dataTestId={`${dataTestId}-left-button`}/>
      </IconContainer>

      <ItemsContainer ref={itemsContainerRef} data-testid={dataTestId}>
        {items}
      </ItemsContainer>

      <IconContainer>
        <FontAwesomeIconButton icon={faChevronRight} onClick={() => onClickScrollPositionButton(false)} dataTestId={`${dataTestId}-right-button`}/>
      </IconContainer>
    </Container>
  )
}

export default HorizontalList
