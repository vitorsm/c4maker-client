import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '../../components/circular-progress'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import Diagram from '../../models/diagram'
import { diagramOperations } from '../../store/reducers/diagrams'
import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ButtonsComponent, EditImageContainer, InputsComponent, InputsContainer } from './style'
import ObjectWrapper from '../../models/object_wrapper'

interface DiagramHeaderComponentProps {
  diagram: Diagram | undefined | null
  isCreating: boolean
  cancelCallback: Function
  closeCallback: Function
  isLoadingDiagram: boolean
}

const DiagramHeaderComponent: FC<DiagramHeaderComponentProps> = ({ diagram, isCreating, cancelCallback, closeCallback, isLoadingDiagram }: DiagramHeaderComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [diagramName, setDiagramName] = useState<string>('')
  const [diagramDescription, setDiagramDescription] = useState<string>('')
  const [isEditingDetails, setIsEditingDetails] = useState(false)

  const persistedDiagram: ObjectWrapper<Diagram> | undefined = useSelector((state: any) => state.diagramReducer.persistedDiagram)

  useEffect(() => {
    if (diagram !== undefined && !isCreating) {
      setIsLoading(false)
      setIsEditingDetails(false)

      setDiagramName(diagram === undefined || diagram === null || diagram.name === null ? '' : diagram.name)
      setDiagramDescription(diagram === undefined || diagram === null || diagram.description === null ? '' : diagram.description)

      if (isCreating && ((diagram?.id) != null)) {
        navigate(`/diagrams/${diagram?.id}`)
      }
    } else {
      setIsEditingDetails(true)

      setDiagramName('')
      setDiagramDescription('')
    }
  }, [diagram, isCreating])

  useEffect(() => {
    setIsLoading(isLoadingDiagram)
  }, [isLoadingDiagram])

  useEffect(() => {
    setIsLoading(false)
  }, [persistedDiagram])

  const handleEditOnClick = (): void => {
    setIsEditingDetails(true)
  }

  const handleCloseOnClick = (): void => {
    closeCallback()
  }

  const handleCancelOnClick = (): void => {
    setIsEditingDetails(false)

    if (diagram !== null && diagram !== undefined && !isCreating) {
      setDiagramName(diagram.name)
      setDiagramDescription(diagram.description !== null ? diagram.description : '')
    } else {
      setDiagramName('')
      setDiagramDescription('')
      cancelCallback()
    }
  }

  const handleSaveOnClick = async (): Promise<void> => {
    if (diagramName === null || diagramDescription === null) {
      return
    }

    if (isCreating) {
      const newDiagram = {
        name: diagramName,
        description: diagramDescription
      }

      void diagramOperations.createDiagram(newDiagram, dispatch)
    } else if (diagram !== undefined && diagram !== null) {
      const newDiagram = { ...diagram }

      newDiagram.name = diagramName
      newDiagram.description = diagramDescription

      void diagramOperations.updateDiagram(newDiagram, dispatch)
    }

    setIsLoading(true)
  }

  const renderEditButton = (): ReactElement | null => {
    if (isLoading || isEditingDetails) {
      return null
    }

    return (
      <ButtonsComponent>
        <EditImageContainer>
          <FontAwesomeIcon icon={faXmark} size="2x" onClick={handleCloseOnClick}/>
        </EditImageContainer>

        <EditImageContainer>
          <FontAwesomeIcon icon={faPenToSquare} size="1x" onClick={handleEditOnClick}/>
        </EditImageContainer>
      </ButtonsComponent>
    )
  }

  const renderButtons = (): ReactElement | null => {
    if (isLoading) {
      return <CircularProgress dataTestId='new-diagram-component-progress' />
    }

    if (!isEditingDetails) {
      return null
    }

    return (
      <>
        <PlainButton text='Cancelar' onClick={handleCancelOnClick} />
        <PlainButton text='Salvar' onClick={handleSaveOnClick} dataTestId='create-diagram-component-save-button' />
      </>
    )
  }

  const renderInputs = (): ReactElement => {
    return (
      <InputsContainer>
        <InputsComponent>
          <TextInput
            title='Name'
            onChange={setDiagramName}
            value={diagramName}
            edit={isEditingDetails}
            dataTestId='create-diagram-component-name'/>

          <TextInput
            title='Description'
            type='text-area'
            fillWidth
            onChange={setDiagramDescription}
            value={diagramDescription}
            edit={isEditingDetails}
            dataTestId='create-diagram-component-description' />

          {renderButtons()}
        </InputsComponent>

        {renderEditButton()}
      </InputsContainer>
    )
  }

  return (
    <>
      {renderInputs()}
    </>
  )
}

export default DiagramHeaderComponent
