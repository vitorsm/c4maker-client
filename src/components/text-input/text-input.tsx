import React, { FC, useState, ReactElement, useEffect } from 'react'
import { Input, Container, Title, TextArea, InputContainer, IconContainer } from './style.js'

interface TextInputProps {
  title?: string | null
  placeholder?: string
  value?: string | undefined
  type?: string | undefined
  onChange?: Function | undefined
  fillWidth?: boolean | undefined
  dataTestId?: string | undefined
  edit?: boolean
  icon?: ReactElement | null
}

const TextInput: FC<TextInputProps> = ({ title = null, placeholder, value = '', type = 'text', onChange, fillWidth, dataTestId = 'text-input', edit = true, icon = null }: TextInputProps) => {
  const [textValue, setTextValue] = useState(value)
  const [inputTextValue, setInputTextValue] = useState(textValue)
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
  const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false)

  useEffect(() => {
    setTextValue(value)
  }, [value])

  useEffect(() => {
    const textToSet = isPlaceholder ? placeholder : textValue
    setInputTextValue(textToSet ?? '')
  }, [textValue, isPlaceholder])

  useEffect(() => {
    setIsPlaceholder(textValue === '' && placeholder !== undefined && !isInputFocused)
  }, [isInputFocused, placeholder, textValue])

  const isTextArea = (): boolean => {
    return type === 'text-area'
  }

  const onChangeHandler = (event: any): void => {
    setTextValue(event.target.value)

    if (onChange !== undefined) {
      onChange(event.target.value)
    }
  }

  const renderTextArea = (): ReactElement => {
    return <TextArea
              disabled={!edit}
              data-testid={dataTestId}
              value={inputTextValue}
              onChange={onChangeHandler}
              type={type}
              fillWidth={fillWidth}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)} />
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
      return (
        <Input
          data-testid={dataTestId}
          value={inputTextValue}
          onChange={onChangeHandler}
          type={type}
          fillWidth={fillWidth}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)} />
      )
    }
  }

  const renderContent = (): ReactElement => {
    if (edit) {
      return renderInputEditMode()
    } else {
      return renderInputNotEditMode()
    }
  }

  const renderIcon = (): ReactElement | null => {
    if (icon === null) {
      return null
    }

    return (
      <IconContainer>
        {icon}
      </IconContainer>
    )
  }

  const renderTitle = (): ReactElement | null => {
    if (title === null) {
      return null
    }

    return (
      <Title>
        {title}
      </Title>
    )
  }
  return (
    <Container>
      {renderTitle()}

      <InputContainer>
        {renderContent()}
        {renderIcon()}
      </InputContainer>
    </Container>
  )
}

export default TextInput
