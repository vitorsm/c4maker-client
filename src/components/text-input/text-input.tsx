import React, { FC, useState, ReactElement, useEffect } from 'react'
import { Input, Container, Title, TextArea } from './style.js'

interface TextInputProps {
  title: string
  value?: string | undefined
  type?: string | undefined
  onChange?: Function | undefined
  fillWidth?: boolean | undefined
  dataTestId?: string | undefined
  edit?: boolean
}

const TextInput: FC<TextInputProps> = ({ title, value = '', type = 'text', onChange, fillWidth, dataTestId = 'text-input', edit = true }: TextInputProps) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const isTextArea = (): boolean => {
    return type === 'text-area'
  }
  const onChangeHandler = (event: any): void => {
    setInputValue(event.target.value)

    if (onChange !== undefined) {
      onChange(event.target.value)
    }
  }

  const renderTextArea = (): ReactElement => {
    return <TextArea
              disabled={!edit}
              data-testid={dataTestId}
              value={inputValue}
              onChange={onChangeHandler}
              type={type}
              fillWidth={fillWidth} />
  }

  const renderInputNotEditMode = (): ReactElement => {
    if (isTextArea()) {
      return renderTextArea()
    }

    return (
      <div data-testid={dataTestId}>
        {value}
      </div>
    )
  }

  const renderInputEditMode = (): ReactElement => {
    if (isTextArea()) {
      return renderTextArea()
    } else {
      return <Input data-testid={dataTestId} value={inputValue} onChange={onChangeHandler} type={type} fillWidth={fillWidth}></Input>
    }
  }

  const renderContent = (): ReactElement => {
    if (edit) {
      return renderInputEditMode()
    } else {
      return renderInputNotEditMode()
    }
  }

  return (
    <Container>
      <Title>
        {title}
      </Title>

      {renderContent()}
    </Container>
  )
}

export default TextInput
