import React, { FC, ReactElement } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import TextInput from '../text-input'
import { Container, IconContainer } from './style'
import FontAwesomeIconButton from '../font-awesome-icon-button/font-awesome-icon-button'

interface SearchInputProps {
  placeholder: string
  onChange: Function
  onClickInfo?: () => void
  text?: string
  dataTestId?: string
}

const SearchInput: FC<SearchInputProps> = ({ onChange, onClickInfo, text, dataTestId, placeholder }: SearchInputProps) => {
  const renderInfoButton = (): ReactElement | null => {
    if (onClickInfo === undefined) {
      return null
    }

    return (
      <IconContainer>
        <FontAwesomeIconButton icon={faCircleInfo} onClick={onClickInfo} dataTestId={`${dataTestId ?? ''}-info-button`}/>
      </IconContainer>
    )
  }

  const renderIcon = (): ReactElement => {
    return <FontAwesomeIcon icon={faMagnifyingGlass} />
  }

  return (
    <Container data-testid={dataTestId}>
      <TextInput
        placeholder={placeholder}
        value={text}
        onChange={onChange}
        dataTestId={`${dataTestId ?? ''}-text-input`}
        edit
        icon={renderIcon()} />

      {renderInfoButton()}
    </Container>
  )
}

export default SearchInput
