import React, { FC, useState } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import CircularMenu from '../../components/circular-menu'
import { Container, ContentCard, TitleContainer, TopLeftMenuContainer, TopRightMenuContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons'
import { setToken } from '../../store/token_utils'
import WorkspaceListComponent from '../workspace/workspace-list-component'

const DEFAULT_ROUTE = 'workspaces'

const MainAuthenticatedRoute: FC = () => {
  const navigate = useNavigate()

  const [contentTitle, setContentTitle] = useState('Homeee')

  const onLogoutClickHandler = (): void => {
    setToken(null)
    navigate('/login')
  }

  const leftMenuItems = [{
    text: 'Workspaces',
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

      <TitleContainer data-testid='main-content-title'>{contentTitle}</TitleContainer>

      <ContentCard data-testid='main-content-card'>
        <Routes>
          <Route index element={<Navigate to={DEFAULT_ROUTE}/>}/>
          <Route path='workspaces/*' element={<WorkspaceListComponent setContentTitle={setContentTitle} />} />
        </Routes>
      </ContentCard>

    </Container>
  )
}

export default MainAuthenticatedRoute
