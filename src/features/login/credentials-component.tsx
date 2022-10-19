import React, { FC, ReactElement, useState, useEffect } from 'react'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import TextLink from '../../components/text-link'
import { ButtonContainer, Container, Content, IconContainer, NewAccountContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { defaultColors } from '../../configs/colors'
import { useDispatch, useSelector } from 'react-redux'
import { userOperations } from '../../store/reducers/users'
import { LoginToken } from '../../models/user'
import ObjectWrapper from '../../models/object_wrapper'
import CircularProgress from '../../components/circular-progress'

interface CredentialsComponentProps {
  login?: string | undefined
  password?: string | undefined
}

const CredentialsComponent: FC<CredentialsComponentProps> = ({ login, password }: CredentialsComponentProps) => {
  const dispatch = useDispatch()
  const [inputLogin, setLogin] = useState(login)
  const [inputPassword, setPassword] = useState(password)
  const [isLoading, setIsLoading] = useState(false)
  const [isLogging, setIsLogging] = useState(false)
  const tokenData: ObjectWrapper<LoginToken> | null = useSelector((state: any) => state.userReducer.tokenData)

  useEffect(() => {
    if (isLogging) {
      const finishedLoading = tokenData !== undefined && tokenData !== null && (tokenData.data !== null || tokenData.error)
      setIsLoading(!finishedLoading)
      setIsLogging(!finishedLoading)
    }
  })

  const createNewAccountOnClick = async (): Promise<void> => {
  }

  const loginOnClick = async (): Promise<void> => {
    if (inputLogin === undefined || inputPassword === undefined) {
      console.error('login or password is undefined', login, password)
      return
    }

    setIsLogging(true)
    setIsLoading(true)

    await userOperations.authenticate(inputLogin, inputPassword, dispatch)
  }

  const renderButton = (): ReactElement => {
    if (isLoading) {
      return (<CircularProgress />)
    } else {
      return (<PlainButton text={'Entrar'} textColor={defaultColors.primary.main} fillWidth onClick={loginOnClick} />)
    }
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
          {renderButton()}
        </ButtonContainer>

        <NewAccountContainer>
          <TextLink text={'Criar conta'} onClick={createNewAccountOnClick}/>
        </NewAccountContainer>
      </Content>
    </Container>
  )
}

export default CredentialsComponent
