import React, { FC, useEffect, useState } from 'react'
import { Input } from './style'

interface TextInputContainerProps {
  placeholder?: string
  value?: string | undefined
  onChange?: Function | undefined
  dataTestId?: string | undefined
  type: string
  fillWidth?: boolean
}

const TextInputContainer: FC<TextInputContainerProps> = ({ placeholder, value, onChange, dataTestId, type, fillWidth = false }: TextInputContainerProps) => {
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

  const onChangeHandler = (event: any): void => {
    setTextValue(event.target.value)

    if (onChange !== undefined) {
      onChange(event.target.value)
    }
  }

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

export default TextInputContainer
