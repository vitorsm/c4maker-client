import React, { FC, useState, ReactElement } from 'react'
import { Input, Container, Title, TextArea } from './style.js'

interface TextInputProps {
  title: string
  value?: string | undefined
  type?: string | undefined
  onChange?: Function | undefined
  fillWidth?: boolean | undefined
  dataTestId?: string | undefined
}

const TextInput: FC<TextInputProps> = ({ title, value = '', type = 'text', onChange, fillWidth, dataTestId = 'text-input' }: TextInputProps) => {
  const [inputValue, setInputValue] = useState(value)

  const onChangeHandler = (event: any): void => {
    setInputValue(event.target.value)

    if (onChange !== undefined) {
      onChange(event.target.value)
    }
  }

  const renderInput = (): ReactElement => {
    if (type === 'text-area') {
      return <TextArea data-testid={dataTestId} value={inputValue} onChange={onChangeHandler} type={type} fillWidth={fillWidth} />
    } else {
      return <Input data-testid={dataTestId} value={inputValue} onChange={onChangeHandler} type={type} fillWidth={fillWidth}></Input>
    }
  }

  return (
    <Container>
      <Title>
        {title}
      </Title>

      {renderInput()}
    </Container>
  )
}

export default TextInput
