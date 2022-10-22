import React, { FC, useEffect, useState } from 'react'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import { NewUserButtonContainer, TitleContainer } from './style'
import { userOperations } from '../../store/reducers/users'
import { useDispatch, useSelector } from 'react-redux'
import { defaultColors } from '../../configs/colors'
import User from '../../models/user'
import ObjectWrapper from '../../models/object_wrapper'
import CircularProgress from '../../components/circular-progress'

interface CreateUserComponentProps {
  returnBackOnClick: Function
}

const CreateUserComponent: FC<CreateUserComponentProps> = ({ returnBackOnClick }) => {
  const dispatch = useDispatch()

  const [name, setName] = useState(null)
  const [login, setLogin] = useState(null)
  const [password, setPassword] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const createdUser: ObjectWrapper<User> | null = useSelector((state: any) => state.userReducer.createdUser)

  useEffect(() => {
    if (createdUser === undefined || createdUser === null || !isAttributesValid()) {
      return
    }

    setIsLoading(false)

    if (createdUser.error) {
      return
    }

    setName(null)
    setLogin(null)
    setPassword(null)

    returnBackOnClick()
  }, [createdUser])

  const isAttributesValid = (): boolean => {
    return name !== null && login !== null && password !== null
  }

  const newUserButtonOnClick = async (): Promise<void> => {
    if (name === null || login === null || password === null) {
      return
    }

    const newUser = {
      name,
      login,
      password
    }

    setIsLoading(true)

    await userOperations.createUser(newUser, dispatch)
  }

  const renderCreateButton = (): any => {
    return isLoading ? (<CircularProgress dataTestId='create-new-user-progress'/>) : (<PlainButton text="Create" fillWidth={true} onClick={newUserButtonOnClick} dataTestId='create-new-user-btn' />)
  }

  return (
    <>
      <TitleContainer data-testid={'create-new-user-title'}>
        Create new user
      </TitleContainer>

      <TextInput title='Name' fillWidth={true} onChange={setName} dataTestId='create-new-user-name-input'/>
      <TextInput title='Login' fillWidth={true} onChange={setLogin} dataTestId='create-new-user-login-input'/>
      <TextInput title='Password' type={'password'} fillWidth={true} onChange={setPassword} dataTestId='create-new-user-password-input' />

      <NewUserButtonContainer>
        {renderCreateButton()}
        <PlainButton text="Back" onClick={returnBackOnClick} color={defaultColors.primary.main} textColor={'white'} dataTestId={'btn-back-create-new-user'}/>
      </NewUserButtonContainer>
    </>
  )
}

export default CreateUserComponent
