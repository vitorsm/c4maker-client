import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/card'
import CircularProgress from '../../../components/circular-progress'
import HorizontalList from '../../../components/horizontal-list'
import PlainButton from '../../../components/plain-button'
import SearchInput from '../../../components/search-input'
import Tooltip from '../../../components/tooltip'
import Diagram from '../../../models/diagram'
import Workspace from '../../../models/workspace'
import { RootState } from '../../../store/reducers'
import { diagramOperations } from '../../../store/reducers/diagrams'
import { Container, DiagramHeader } from './style'
import WorkpsaceCreateDiagramDialog from './workspace-create-diagram-dialog'

interface WorkspaceDiagramComponentProps {
  workspace: Workspace | null
}

const WorkspaceDiagramComponent: FC<WorkspaceDiagramComponentProps> = ({ workspace }: WorkspaceDiagramComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showDialogCreate, setShowDialogCreate] = useState<boolean>(false)
  const [filteredDiagrams, setFilteredDiagrams] = useState<Diagram[]>([])

  const diagrams = useSelector((rootState: RootState) => rootState.diagramReducer.diagrams)

  useEffect(() => {
    fetchDiagrams()
  }, [workspace])

  useEffect(() => {
    setIsLoading(false)
    setFilteredDiagrams(diagrams.data ?? [])
  }, [diagrams])

  const fetchDiagrams = (): void => {
    if (workspace === null || workspace.id === undefined) {
      return
    }

    void diagramOperations.fetchDiagramsByWorkspace(workspace.id, dispatch)
    setIsLoading(true)
  }

  const onClickCreateNewDiagram = (): void => {
    setShowDialogCreate(true)
  }

  const onCloseDiagramCreate = (diagram: Diagram | undefined): void => {
    setShowDialogCreate(false)
    if (diagram !== undefined) {
      fetchDiagrams()
    }
  }

  const onClickDiagram = (diagram: Diagram): void => {
    if (diagram.id === undefined || diagram.id === null) {
      return
    }

    navigate(`diagram/${diagram.id}`, {
      state: { timestampLoaded: Date.now() }
    })
  }

  const onSearchChange = (text: string): void => {
    let filtered = diagrams.data ?? []
    filtered = filtered.filter(diagram => diagram.name.toLowerCase().includes(text.toLowerCase()))
    setFilteredDiagrams(filtered)
  }

  const renderDiagramItems = (): ReactElement[] => {
    return filteredDiagrams.map((diagram, index) => (
      <Tooltip text={diagram.description} key={`diagram-button-${index}`}>
        <Card description={diagram.name} onClick={() => onClickDiagram(diagram)} dataTestId={`list-diagram-card-${index}`}>
          <FontAwesomeIcon icon={faDiagramProject} size="2x" />
        </Card>
      </Tooltip>
    ))
  }

  const renderDiagramsComponent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress dataTestId={'workspace-diagram-progress'} />
      )
    }

    return (<HorizontalList items={renderDiagramItems()} />)
  }

  return (
    <Container>
      <DiagramHeader>
        <SearchInput onChange={onSearchChange} placeholder={'Buscar diagrama...'} onClickInfo={() => null} />
        <PlainButton text={'Criar diagrama'} onClick={onClickCreateNewDiagram} />
      </DiagramHeader>

      {renderDiagramsComponent()}
      <WorkpsaceCreateDiagramDialog workspace={workspace} show={showDialogCreate} onCloseDialog={onCloseDiagramCreate} />
    </Container>
  )
}

export default WorkspaceDiagramComponent
