import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '../../components/circular-progress'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import { workspaceOperations } from '../../store/reducers/workspaces'
import { faPenToSquare, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ButtonsComponent, EditImageContainer, InputsComponent, InputsContainer } from './style'
import ObjectWrapper from '../../models/object_wrapper'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'

interface WorkspaceHeaderComponentProps {
  workspace: Workspace | undefined | null
  isCreating: boolean
  cancelCallback: Function
  closeCallback: Function
  isLoadingWorkspace: boolean
  persistedWorkspaceCallback: Function
}

const WorkspaceHeaderComponent: FC<WorkspaceHeaderComponentProps> = ({ workspace, isCreating, cancelCallback, closeCallback, isLoadingWorkspace, persistedWorkspaceCallback }: WorkspaceHeaderComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [workspaceName, setWorkspaceName] = useState<string>('')
  const [workspaceDescription, setWorkspaceDescription] = useState<string>('')
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isAfterPersist, setIsAfterPersist] = useState(false)

  const persistedWorkspace: ObjectWrapper<Workspace> = useSelector((state: RootState) => state.workspaceReducer.persistedWorkspace)

  useEffect(() => {
    if (workspace !== undefined && !isCreating) {
      setIsLoading(false)
      setIsEditingDetails(false)

      setWorkspaceName(workspace === undefined || workspace === null || workspace.name === null ? '' : workspace.name)
      setWorkspaceDescription(workspace === undefined || workspace === null || workspace.description === null ? '' : workspace.description)

      if (isCreating && ((workspace?.id) != null)) {
        navigate(`/workspaces/${workspace?.id}`)
      }
    } else {
      setIsEditingDetails(true)

      setWorkspaceName('')
      setWorkspaceDescription('')
    }
  }, [workspace, isCreating])

  useEffect(() => {
    setIsLoading(isLoadingWorkspace)
  }, [isLoadingWorkspace])

  useEffect(() => {
    setIsLoading(false)

    if (persistedWorkspace.data !== null && !persistedWorkspace.error && isAfterPersist) {
      persistedWorkspaceCallback()
    }
  }, [persistedWorkspace])

  const handleEditOnClick = (): void => {
    setIsEditingDetails(true)
  }

  const handleCloseOnClick = (): void => {
    closeCallback()
  }

  const handleCancelOnClick = (): void => {
    setIsEditingDetails(false)

    if (workspace !== null && workspace !== undefined && !isCreating) {
      setWorkspaceName(workspace.name)
      setWorkspaceDescription(workspace.description !== null ? workspace.description : '')
    } else {
      setWorkspaceName('')
      setWorkspaceDescription('')
      cancelCallback()
    }
  }

  const handleSaveOnClick = async (): Promise<void> => {
    if (workspaceName === null || workspaceDescription === null) {
      return
    }

    if (isCreating) {
      const newWorkspace = {
        name: workspaceName,
        description: workspaceDescription
      }

      void workspaceOperations.createWorkspace(newWorkspace, dispatch)
    } else if (workspace !== undefined && workspace !== null) {
      const newWorkspace = { ...workspace }

      newWorkspace.name = workspaceName
      newWorkspace.description = workspaceDescription

      void workspaceOperations.updateWorkspace(newWorkspace, dispatch)
    }

    setIsAfterPersist(true)
    setIsLoading(true)
  }

  const renderEditButton = (): ReactElement | null => {
    if (isLoading || isEditingDetails) {
      return null
    }

    return (
      <ButtonsComponent>
        <EditImageContainer>
          <FontAwesomeIcon icon={faArrowLeft} size="1x" onClick={handleCloseOnClick}/>
        </EditImageContainer>

        <EditImageContainer>
          <FontAwesomeIcon icon={faPenToSquare} size="1x" onClick={handleEditOnClick}/>
        </EditImageContainer>
      </ButtonsComponent>
    )
  }

  const renderButtons = (): ReactElement | null => {
    if (isLoading) {
      return <CircularProgress dataTestId='new-workspace-component-progress' />
    }

    if (!isEditingDetails) {
      return null
    }

    return (
      <>
        <PlainButton text='Cancelar' onClick={handleCancelOnClick} />
        <PlainButton text='Salvar' onClick={handleSaveOnClick} dataTestId='create-workspace-component-save-button' />
      </>
    )
  }

  const renderInputs = (): ReactElement => {
    return (
      <InputsContainer>
        <InputsComponent>
          <TextInput
            title='Name'
            onChange={setWorkspaceName}
            value={workspaceName}
            edit={isEditingDetails}
            dataTestId='create-workspace-component-name'/>

          <TextInput
            title='Description'
            type='text-area'
            fillWidth
            onChange={setWorkspaceDescription}
            value={workspaceDescription}
            edit={isEditingDetails}
            dataTestId='create-workspace-component-description' />

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

export default WorkspaceHeaderComponent
