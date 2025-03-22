import React, { FC, ReactElement, useEffect, useState } from 'react'
import Card from '../../components/card'
import { Container, WorkspaceButtons, EmptyStateContainer, ProgressContainer, ProgressDescriptionContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faInbox, faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../../components/text-link'
import { workspaceOperations } from '../../store/reducers/workspaces'
import { useDispatch, useSelector } from 'react-redux'
import ObjectWrapper from '../../models/object_wrapper'
import CircularProgress from '../../components/circular-progress'
import AnimatedContainer from '../../components/animated-container'
import { Route, Routes, useNavigate, useResolvedPath } from 'react-router-dom'
import WorkspaceComponent from './workspace-component'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'
import Tooltip from '../../components/tooltip'
import useBreadcrumbs from '../../store/reducers/breadcrumbs/use-breadcrumbs'
import User from '../../models/user'

const WorkspaceListComponent: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const resolvedPath = useResolvedPath('')
  const workspaces: ObjectWrapper<Workspace[]> = useSelector((state: RootState) => state.workspaceReducer.workspaces)
  const currentUser: ObjectWrapper<User> = useSelector((state: RootState) => state.userReducer.currentUser)

  const { addBreadcrumbItem } = useBreadcrumbs()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    addBreadcrumbItem({
      key: 'workspaces',
      name: 'Workspaces',
      details: 'List of Workspace',
      onClick: () => navigate('/workspaces')
    }, 1)
  }, [resolvedPath])

  useEffect(() => {
    if (currentUser.data !== null) {
      void workspaceOperations.fetchUserWorkspaces(dispatch)
      setIsLoading(true)
    }
  }, [currentUser])

  useEffect(() => {
    if (workspaces.data !== null) {
      setIsLoading(false)
    }
  }, [workspaces])

  const hasWorkspaces = (): boolean => {
    return workspaces.data !== null && workspaces.data.length > 0
  }

  const onClickNewWorkspace = (): void => {
    navigate('new')
  }

  const renderEmptyStateOrLoading = (): ReactElement | null => {
    if (isLoading) {
      return (
        <ProgressContainer>
          <CircularProgress size={100} dataTestId={'workspace-list-progress'}/>
          <ProgressDescriptionContainer>
            buscando workspaces
          </ProgressDescriptionContainer>
        </ProgressContainer>
      )
    }

    if (hasWorkspaces()) {
      return null
    }

    return (
      <EmptyStateContainer>
        <FontAwesomeIcon icon={faInbox} size="10x" style={{ padding: 20 }}/>
          Voce ainda não tem workspaces.
        <TextLink onClick={onClickNewWorkspace} dataTestId='workspace-empty-state-new-item-link'>Clique aqui para criar um novo workspace</TextLink>
      </EmptyStateContainer>
    )
  }

  const defineWorkspaceOnClick = (workspaceId: string = ''): Function | null => {
    return () => {
      navigate(`${workspaceId}`)
    }
  }

  const renderWorkspaces = (): null | ReactElement[] => {
    if (isLoading) {
      return null
    }

    if (!hasWorkspaces() || workspaces.data == null) {
      return null
    }

    const result = workspaces.data.map((workspace, index) => {
      return (
        <Tooltip text={workspace.description} key={`workspace-button-${index}`}>
          <Card description={workspace.name} onClick={defineWorkspaceOnClick(workspace.id)} dataTestId={`list-workspace-card-${index}`}>
            <FontAwesomeIcon icon={faDiagramProject} size="2x" />
          </Card>
        </Tooltip>
      )
    })

    return [(
      <Card key='workspace-button-create-new' description={'Novo workspace'} onClick={onClickNewWorkspace}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </Card>
    ), ...result]
  }

  const renderWorkspaceButtons = (): ReactElement => {
    return (
      <AnimatedContainer>
        <WorkspaceButtons>
          {renderWorkspaces()}
        </WorkspaceButtons>
      </AnimatedContainer>
    )
  }

  const renderContent = (): ReactElement => {
    return (
      <Routes>
        <Route path='new/*' element={<WorkspaceComponent />} />
        <Route path='/:workspaceId/*' element={<WorkspaceComponent />} />
        <Route path='' element={renderWorkspaceButtons()} />
      </Routes>
    )
  }

  return (
    <Container data-testid='workspaces-container-component'>
      {renderEmptyStateOrLoading()}
      {renderContent()}
    </Container>
  )
}

export default WorkspaceListComponent
