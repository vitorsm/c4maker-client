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
import { Route, Routes, useNavigate } from 'react-router-dom'
import DiagramComponent from './workspace-component'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'

interface WorkspaceListComponentProps {
  setContentTitle: Function
}

const WorkspaceListComponent: FC<WorkspaceListComponentProps> = ({ setContentTitle }: WorkspaceListComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const workspaces: ObjectWrapper<Workspace[]> = useSelector((state: RootState) => state.workspaceReducer.workspaces)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setContentTitle('Workspaces')
  })

  useEffect(() => {
    if (workspaces.data === null) {
      if (!isLoading) {
        void workspaceOperations.fetchUserWorkspaces(dispatch)
        setIsLoading(true)
      }
    } else {
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
          <CircularProgress size={100}/>
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
        <TextLink text='Clique aqui para criar um novo workspace' onClick={onClickNewWorkspace}/>
      </EmptyStateContainer>
    )
  }

  const defineWorkspaceOnClick = (workspaceId?: string): Function | null => {
    if (workspaceId === undefined || workspaceId === null) {
      return null
    }

    return () => {
      navigate(`${workspaceId}`)
    }
  }

  const renderWorkspaces = (): null | ReactElement[] => {
    if (isLoading) {
      return null
    }

    if (!hasWorkspaces()) {
      return null
    }

    const result = workspaces.data?.map((workspace, index) => {
      return (
        <Card key={`workspace-button-${index}`} description={workspace.name} onClick={defineWorkspaceOnClick(workspace.id)}>
          <FontAwesomeIcon icon={faDiagramProject} size="2x" />
        </Card>
      )
    })

    return result !== undefined
      ? [(
      <Card key='workspace-button-create-new' description={'Novo workspace'} onClick={onClickNewWorkspace}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </Card>
        ), ...result]
      : null
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
        <Route path='new' element={<DiagramComponent />} />
        <Route path='/:workspaceId' element={<DiagramComponent />} />
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
