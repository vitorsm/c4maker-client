import React, { FC, useState } from 'react'
import { Input, Container, Title } from './style.js'

interface TextInputProps {
  title: string
  value?: string | undefined
  type?: string | undefined
  onChange?: Function | undefined
  fillWidth?: boolean | undefined
}

const TextInput: FC<TextInputProps> = ({ title, value = '', type = 'text', onChange, fillWidth }: TextInputProps) => {
  const [inputValue, setInputValue] = useState(value)

  const onChangeHandler = (event: any): void => {
    setInputValue(event.target.value)

    if (onChange !== undefined && onChange != null) {
      onChange(event.target.value)
    }
  }

  return (
    <Container>
      <Title>
        {title}
      </Title>

      <Input value={inputValue} onChange={onChangeHandler} type={type} fillWidth={fillWidth}></Input>
    </Container>
  )
}

export default TextInput
