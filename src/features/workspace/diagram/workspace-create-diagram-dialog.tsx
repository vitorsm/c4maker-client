import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '../../../components/circular-progress'
import Dialog from '../../../components/dialog'
import SelectComponent from '../../../components/select-component/select-component'
import TextInput from '../../../components/text-input'
import Diagram, { DiagramType } from '../../../models/diagram'
import Workspace from '../../../models/workspace'
import { RootState } from '../../../store/reducers'
import { diagramOperations } from '../../../store/reducers/diagrams'
import { CreateDiagramContainer } from './style'

const DIAGRAM_TYPES_OPTIONS = [{ key: DiagramType.C4, content: DiagramType.C4 }, { key: DiagramType.SEQUENCE, content: DiagramType.SEQUENCE }]

interface WorkpsaceCreateDiagramDialogProps {
  workspace: Workspace | null
  show: boolean
  onCloseDialog: Function
}

const WorkpsaceCreateDiagramDialog: FC<WorkpsaceCreateDiagramDialogProps> = ({ workspace, show, onCloseDialog }: WorkpsaceCreateDiagramDialogProps) => {
  const dispatch = useDispatch()
  const [diagramName, setDiagramName] = useState<string>('')
  const [diagramDescription, setDiagramDescription] = useState<string>('')
  const [diagramType, setDiagramType] = useState(DiagramType.C4.toString())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const createdDiagram = useSelector((rootState: RootState) => rootState.diagramReducer.diagram)

  useEffect(() => {
    setIsLoading(false)
    if (!createdDiagram.error) {
      closeDialog(createdDiagram.data ?? undefined)
    }
  }, [createdDiagram])

  const closeDialog = (diagram: Diagram | undefined): void => {
    setDiagramName('')
    setDiagramDescription('')
    setDiagramType(DiagramType.C4)
    onCloseDialog(diagram)
  }

  const onOkClick = (): void => {
    if (isLoading || workspace === null) {
      return
    }

    const diagram: Diagram = {
      name: diagramName,
      description: diagramDescription,
      diagram_type: diagramType,
      workspace
    }

    void diagramOperations.createDiagram(diagram, dispatch)
    setIsLoading(true)
  }

  const onCancelClick = (): void => {
    if (isLoading) {
      return
    }

    closeDialog(undefined)
  }

  const renderLoading = (): ReactElement | null => {
    if (!isLoading) {
      return null
    }

    return (
      <CircularProgress />
    )
  }

  return (
    <Dialog show={show} title={'Create new diagram'} onOkClick={onOkClick} onCancelClick={onCancelClick}>
      <CreateDiagramContainer>
        <TextInput title={'Nome'} value={diagramName} onChange={setDiagramName} />
        <TextInput title={'Descrição'} value={diagramDescription} onChange={setDiagramDescription} type={'text-area'} />
        <SelectComponent title={'Tipo'} items={DIAGRAM_TYPES_OPTIONS} onChangeSelection={setDiagramType} selectedKey={diagramType} />
        {renderLoading()}
      </CreateDiagramContainer>
    </Dialog>
  )
}

export default WorkpsaceCreateDiagramDialog
