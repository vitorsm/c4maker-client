import React, { FC, useState } from 'react'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import TextLink from '../../components/text-link'
import { ButtonContainer, Container, Content, IconContainer, NewAccountContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { defaultColors } from '../../configs/colors'
import { useDispatch } from 'react-redux'
import { userOperations } from '../../store/reducers/users'

interface CredentialsComponentProps {
  login?: string | undefined
  password?: string | undefined
}

const CredentialsComponent: FC<CredentialsComponentProps> = ({ login, password }: CredentialsComponentProps) => {
  const [inputLogin, setLogin] = useState(login)
  const [inputPassword, setPassword] = useState(password)
  const dispatch = useDispatch()

  const createNewAccountOnClick = async (): Promise<void> => {
    if (inputLogin === undefined || inputPassword === undefined) {
      console.error('login or password is undefined', login, password)
      return
    }
    console.log('will call')

    await userOperations.authenticate(inputLogin, inputPassword, dispatch)
  }

  return (
    <Container>
      <Content>
        <IconContainer>
          <FontAwesomeIcon icon={faUser} size="6x" />
        </IconContainer>

        <TextInput title={'Login'} value={inputLogin} onChange={setLogin} fillWidth={true} />
        <TextInput title={'Senha'} value={inputPassword} onChange={setPassword} type={'password'} fillWidth={true} />

        <ButtonContainer>
          <PlainButton text={'Entrar'} textColor={defaultColors.primary.main} fillWidth onClick={createNewAccountOnClick} />
        </ButtonContainer>

        <NewAccountContainer>
          <TextLink text={'Criar conta'} onClick={createNewAccountOnClick}/>
        </NewAccountContainer>
      </Content>
    </Container>
  )
}

export default CredentialsComponent
