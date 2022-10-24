import React, { FC, ReactElement, useEffect, useState } from 'react'
import Card from '../../components/card'
import { Container, DiagramButtons, EmptyStateContainer, ProgressContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faInbox } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../../components/text-link'
import { diagramOperations } from '../../store/reducers/diagrams'
import { useDispatch, useSelector } from 'react-redux'
import ObjectWrapper from '../../models/object_wrapper'
import Diagram from '../../models/diagram'
import CircularProgress from '../../components/circular-progress'

const DiagramComponent: FC = () => {
  const dispatch = useDispatch()
  const diagrams: ObjectWrapper<Diagram[]> | undefined = useSelector((state: any) => state.diagramReducer.diagrams)
  const [isLoading, setIsLoading] = useState(false)

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

  }

  const renderEmptyStateOrLoading = (): ReactElement | null => {
    if (isLoading) {
      return (<ProgressContainer><CircularProgress size={100}/></ProgressContainer>)
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

  const renderDiagrams = (): null | ReactElement[] => {
    if (isLoading) {
      return null
    }

    if (!hasDiagrams()) {
      return null
    }

    const result = diagrams?.data?.map((diagram, index) => {
      return (
        <Card key={`diagram-button-${index}`} description={diagram.name}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </Card>
      )
    })

    return result !== undefined
      ? [(
      <Card key='diagram-button-create-new' description={'Novo diagrama'}>
        <FontAwesomeIcon icon={faPlus} size="2x" />
      </Card>
        ), ...result]
      : null
  }

  return (
    <Container>
      {renderEmptyStateOrLoading()}

      <DiagramButtons>
        {renderDiagrams()}
      </DiagramButtons>

    </Container>
  )
}

export default DiagramComponent
