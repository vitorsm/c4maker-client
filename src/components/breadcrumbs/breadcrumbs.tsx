import React, { FC, ReactElement, useEffect, useState } from 'react'
import { faChevronRight, faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { ButtonsContainer, Container, Content, ItemContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TextLink from '../text-link'
import FontAwesomeIconButton from '../font-awesome-icon-button/font-awesome-icon-button'
import TextInput from '../text-input'
import Tooltip from '../tooltip'

export interface BreadcrumbsItem {
  key: string | null
  name: string
  details: string | null
  onClick: Function | null
  editable?: boolean
  timestamp?: number | undefined
}

interface BreadcrumbsProps {
  items: BreadcrumbsItem[]
  onLastItemChange: Function
  textLinkColor?: string
  lastTextLinkColor?: string
  dataTestId?: string
}

export const generateEmptyBreadcrumbs = (key: string | null, name: string): BreadcrumbsItem => ({
  key,
  name,
  details: null,
  onClick: null,
  editable: true,
  timestamp: 0
})

export const DEFAULT_BREADCRUMBS_TEST_ID = 'default-breadcrumbs'

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items, onLastItemChange, textLinkColor, lastTextLinkColor, dataTestId = DEFAULT_BREADCRUMBS_TEST_ID }: BreadcrumbsProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [lastItemName, setLastItemName] = useState<string>('')

  useEffect(() => {
    if (items.length > 0) {
      setLastItemName(items[items.length - 1].name)
    }
  }, [items])

  const onClickEditButton = (): void => {
    setIsEditing(true)
  }

  const onClickCancelEdit = (): void => {
    setIsEditing(false)
  }

  const onClickConfirmEdit = (): void => {
    const lastItem = items[items.length - 1]
    lastItem.name = lastItemName
    onLastItemChange(lastItem)
    setIsEditing(false)
  }

  const isLastItem = (index: number): boolean => {
    return index + 1 === items.length
  }

  const renderActionButtons = (item: BreadcrumbsItem): ReactElement | null => {
    if (item.editable === undefined || !item.editable) {
      return null
    }

    if (!isEditing) {
      return (
        <ButtonsContainer>
          <FontAwesomeIconButton icon={faPen} size="1x" onClick={onClickEditButton} dataTestId={`${dataTestId}-edit-button`}/>
        </ButtonsContainer>
      )
    }

    return (
      <ButtonsContainer>
        <FontAwesomeIconButton icon={faCheck} size="1x" onClick={onClickConfirmEdit} border dataTestId={`${dataTestId}-confirm-button`}/>
        <FontAwesomeIconButton icon={faXmark} size="1x" onClick={onClickCancelEdit} border dataTestId={`${dataTestId}-cancel-button`}/>
      </ButtonsContainer>
    )
  }

  const renderItem = (item: BreadcrumbsItem, isLastItem: boolean, index: number): ReactElement => {
    const getColor = (): string | undefined => {
      if (!isLastItem) {
        return textLinkColor
      }

      if (lastTextLinkColor !== undefined) {
        return lastTextLinkColor
      }

      return textLinkColor
    }
    if (!isLastItem || !isEditing) {
      return (
        <Tooltip text={item.details}>
          <TextLink onClick={item.onClick} color={getColor()} dataTestId={`${dataTestId}-text-link-${index}`}>
            {item.name}
          </TextLink>
        </Tooltip>
      )
    }

    return (
      <Content>
        <TextInput title={null} value={lastItemName} onChange={setLastItemName} dataTestId={`${dataTestId}-text-input-${index}`}/>
      </Content>
    )
  }

  const renderItems = (): ReactElement[] => {
    return items.map((item, index: number) => (
      <ItemContainer key={`breadcrumbs_item_${index}`}>
        <Content key={`breadcrumb_item_${index}`}>
          {renderItem(item, isLastItem(index), index)}
        </Content>

        {isLastItem(index) || (
          <Content>
            <FontAwesomeIcon icon={faChevronRight} size="1x" />
          </Content>
        )}

        {isLastItem(index) && renderActionButtons(item)}
      </ItemContainer>
    ))
  }

  return (
    <Container data-testid={dataTestId}>
      {renderItems()}
    </Container>
  )
}

export default Breadcrumbs
