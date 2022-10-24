import React, { FC } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import CircularMenu from '../../components/circular-menu'
import { Container, ContentCard, TitleContainer, TopLeftMenuContainer, TopRightMenuContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import { setToken } from '../../store/token_utils'
import DiagramComponent from '../diagrams/diagram-component'

const MainAuthenticatedRoute: FC = () => {
  const navigate = useNavigate()

  const onLogoutClickHandler = (): void => {
    setToken(null)
    navigate('/login')
  }
  const leftMenuItems = [{
    text: 'Diagramas',
    onClick: () => {},
    disabled: false
  }, {
    text: 'Configuração',
    onClick: () => {},
    disabled: true
  }]

  const rightMenuItems = [{
    text: 'Config do usuário',
    onClick: () => {},
    disabled: true
  }, {
    text: 'Sair',
    onClick: onLogoutClickHandler,
    disabled: false
  }]

  return (
    <Container data-testid='main-authenticated-route-component'>
      <TopLeftMenuContainer>
        <CircularMenu menuItems={leftMenuItems} icon={<FontAwesomeIcon icon={faBars} size="2x" />} size={60} />
      </TopLeftMenuContainer>

      <TopRightMenuContainer>
        <CircularMenu menuItems={rightMenuItems} icon={<FontAwesomeIcon icon={faUser} size="2x" />} size={60} marginLeft={-100} />
      </TopRightMenuContainer>

      <TitleContainer>Diagramas</TitleContainer>

      <ContentCard>
        <Routes>
          <Route path='diagrams' element={<DiagramComponent />} />
        </Routes>
      </ContentCard>

    </Container>
  )
}

export default MainAuthenticatedRoute
