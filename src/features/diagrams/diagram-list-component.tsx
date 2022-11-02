import React, { FC, ReactElement, useEffect, useState } from 'react'
import Card from '../../components/card'
import { Container, DiagramButtons, EmptyStateContainer, ProgressContainer, ProgressDescriptionContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faInbox, faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../../components/text-link'
import { diagramOperations } from '../../store/reducers/diagrams'
import { useDispatch, useSelector } from 'react-redux'
import ObjectWrapper from '../../models/object_wrapper'
import Diagram from '../../models/diagram'
import CircularProgress from '../../components/circular-progress'
import AnimatedContainer from '../../components/animated-container'
import { Route, Routes, useNavigate } from 'react-router-dom'
import DiagramComponent from './diagram-component'

interface DiagramListComponentProps {
  setContentTitle: Function
}

const DiagramListComponent: FC<DiagramListComponentProps> = ({ setContentTitle }: DiagramListComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const diagrams: ObjectWrapper<Diagram[]> | undefined = useSelector((state: any) => state.diagramReducer.diagrams)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setContentTitle('Diagrams')
  })

  useEffect(() => {
    if (diagrams === undefined) {
      if (!isLoading) {
        void diagramOperations.fetchUserDiagrams(dispatch)
        setIsLoading(true)
      }
    } else {
      setIsLoading(false)
    }
  }, [diagrams])

  const hasDiagrams = (): boolean => {
    if (diagrams === undefined) {
      return false
    }

    return diagrams.data !== null && diagrams.data.length > 0
  }

  const onClickNewDiagram = (): void => {
    navigate('new')
  }

  const renderEmptyStateOrLoading = (): ReactElement | null => {
    if (isLoading) {
      return (
        <ProgressContainer>
          <CircularProgress size={100}/>
          <ProgressDescriptionContainer>
            buscando diagramas
          </ProgressDescriptionContainer>
        </ProgressContainer>
      )
    }

    if (hasDiagrams()) {
      return null
    }

    return (
      <EmptyStateContainer>
        <FontAwesomeIcon icon={faInbox} size="10x" style={{ padding: 20 }}/>
        Voce ainda não tem diagramas.
        <TextLink text='Clique aqui para criar um novo diagrama' onClick={onClickNewDiagram}/>
      </EmptyStateContainer>
    )
  }

  const defineDiagramOnClick = (diagramId?: string): Function | null => {
    if (diagramId === undefined || diagramId === null) {
      return null
    }

    return () => {
      navigate(`${diagramId}`)
    }
  }

  const renderDiagrams = (): null | ReactElement[] => {
    if (isLoading) {
      return null
    }

    if (!hasDiagrams()) {
      return null
    }

    const result = diagrams?.data?.map((diagram, index) => {
      return (
        <Card key={`diagram-button-${index}`} description={diagram.name} onClick={defineDiagramOnClick(diagram.id)}>
          <FontAwesomeIcon icon={faDiagramProject} size="2x" />
        </Card>
      )
    })

    return result !== undefined
      ? [(
      <Card key='diagram-button-create-new' description={'Novo diagrama'} onClick={onClickNewDiagram}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </Card>
        ), ...result]
      : null
  }

  const renderDiagramButtons = (): ReactElement => {
    return (
      <AnimatedContainer>
        <DiagramButtons>
          {renderDiagrams()}
        </DiagramButtons>
      </AnimatedContainer>
    )
  }

  const renderContent = (): ReactElement => {
    return (
      <Routes>
        <Route path='new' element={<DiagramComponent />} />
        <Route path='/:diagramId' element={<DiagramComponent />} />
        <Route path='' element={renderDiagramButtons()} />
      </Routes>
    )
  }

  return (
    <Container data-testid='diagrams-container-component'>
      {renderEmptyStateOrLoading()}
      {renderContent()}
    </Container>
  )
}

export default DiagramListComponent
