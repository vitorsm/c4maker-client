import React, { useState } from 'react'
import CreateUserComponent from './create-user-component'
import CredentialsComponent from './credentials-component'
import { ScreenContainer, Container, Content } from './style'

const LoginScreen = (): any => {
  const [showCreateNewUser, setShowCreateNewUser] = useState(false)

  const createNewAccountOnClick = (): any => {
    setShowCreateNewUser(true)
  }

  const returnBackOnClick = (): any => {
    setShowCreateNewUser(false)
  }

  const renderContent = (): any => {
    return showCreateNewUser ? <CreateUserComponent returnBackOnClick={returnBackOnClick} /> : <CredentialsComponent createNewAccountOnClick={createNewAccountOnClick} />
  }

  return (
    <ScreenContainer>
      <Container>
        <Content>
          {renderContent()}
        </Content>
      </Container>
    </ScreenContainer>
  )
}

export default LoginScreen
