import React, { FC, ReactElement } from 'react'
import Card from '../../components/card'
import { Container, DiagramButtons, EmptyStateContainer } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faInbox } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../../components/text-link'

const DiagramComponent: FC = () => {
  const onClickNewDiagram = (): void => {

  }

  const renderEmptyState = (): ReactElement => {
    return (
      <EmptyStateContainer>
        <FontAwesomeIcon icon={faInbox} size="10x" style={{ padding: 20 }}/>
        Voce ainda não tem diagramas.
        <TextLink text='Clique aqui para criar um novo diagrama' onClick={onClickNewDiagram}/>
      </EmptyStateContainer>
    )
  }

  const renderDiagrams = (): ReactElement => {
    return renderEmptyState()
  }

  return (
    <Container>
      {renderDiagrams()}
      <DiagramButtons>
        <Card description={'Novo diagrama'}>
          <FontAwesomeIcon icon={faPlus} size="2x" />
        </Card>
      </DiagramButtons>
    </Container>
  )
}

export default DiagramComponent
