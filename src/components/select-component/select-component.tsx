import React, { FC, ReactElement } from 'react'
import { Container, Select, SelectItemComponent, Title } from './style'

export interface SelectItem {
  key: string
  content: string | ReactElement
}

interface SelectComponentProps {
  title?: string
  items: SelectItem[]
  selectedKey?: string
  onChangeSelection: (selectedKey: string) => void
  dataTestId?: string
}

const SelectComponent: FC<SelectComponentProps> = ({ title, items, selectedKey, onChangeSelection, dataTestId }: SelectComponentProps) => {
  const internalOnChange = (event: any): void => {
    onChangeSelection(event.target.value)
  }

  const renderOptions = (): ReactElement[] => {
    return items.map((item, index) => {
      return (
        <SelectItemComponent
          key={index}
          value={item.key}
          data-testid={`${dataTestId ?? ''}-option-${index}`}>
          {item.content}
        </SelectItemComponent>
      )
    })
  }

  return (
    <Container>
      <Title>
        {title}
      </Title>

      <Select
        data-testid={`${dataTestId ?? ''}-select`}
        defaultValue={selectedKey}
        onChange={internalOnChange}>
        {renderOptions()}
      </Select>
    </Container>
  )
}

export default SelectComponent
