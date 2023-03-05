import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CircularProgress from '../../components/circular-progress'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import { workspaceOperations } from '../../store/reducers/workspaces'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { ButtonsComponent, EditImageContainer, InputsComponent, InputsContainer } from './style'
import ObjectWrapper from '../../models/object_wrapper'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'
import FontAwesomeIconButton from '../../components/font-awesome-icon-button/font-awesome-icon-button'
import { NEW_WORKSPACE_NAME } from './workspace-component'
import Tooltip from '../../components/tooltip'
import Dialog from '../../components/dialog'

interface WorkspaceHeaderComponentProps {
  workspace: Workspace | undefined | null
  isCreation: boolean
  cancelCallback: Function
  closeCallback: Function
  isLoadingWorkspace: boolean
  persistedWorkspaceCallback: Function
  setIsCreating: Function
}

const WorkspaceHeaderComponent: FC<WorkspaceHeaderComponentProps> = ({ workspace, isCreation, cancelCallback, closeCallback, isLoadingWorkspace, persistedWorkspaceCallback, setIsCreating }: WorkspaceHeaderComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [workspaceDescription, setWorkspaceDescription] = useState<string>('')
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [isAfterPersist, setIsAfterPersist] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const persistedWorkspace: ObjectWrapper<Workspace> = useSelector((state: RootState) => state.workspaceReducer.workspace)
  const workspaces: ObjectWrapper<Workspace[]> = useSelector((state: RootState) => state.workspaceReducer.workspaces)
  const deletedWorkspace: ObjectWrapper<string> = useSelector((state: RootState) => state.workspaceReducer.deletedWorkspace)

  useEffect(() => {
    if (workspace !== undefined && !isCreation) {
      setIsLoading(false)
      setIsEditingDetails(false)

      setWorkspaceDescription(workspace === undefined || workspace === null || workspace.description === null ? '' : workspace.description)
    } else {
      setIsEditingDetails(true)

      setWorkspaceDescription('')
    }
  }, [workspace, isCreation])

  useEffect(() => {
    setIsLoading(isLoadingWorkspace)
  }, [isLoadingWorkspace])

  useEffect(() => {
    setIsLoading(false)

    if (persistedWorkspace.data !== null && !persistedWorkspace.error && isAfterPersist) {
      persistedWorkspaceCallback()
    }
  }, [persistedWorkspace])

  useEffect(() => {
    setIsLoading(false)
    if (!deletedWorkspace.error && deletedWorkspace.data !== null && deletedWorkspace.data === workspace?.id) {
      updateWorkspacesListByDeletedWorkspace()
      navigate(-1)
    }
  }, [deletedWorkspace])

  const updateWorkspacesListByDeletedWorkspace = (): void => {
    if (workspaces.data === null || deletedWorkspace.data === null) {
      return
    }

    const newWorkspaces = workspaces.data.filter(w => w.id !== deletedWorkspace.data)

    void workspaceOperations.updateWorkspacesList(newWorkspaces, dispatch)
  }

  const descriptionOnDoubleClick = (): void => {
    setIsEditingDetails(true)
  }
  const handleEditOnClick = (): void => {
    setIsEditingDetails(true)
  }

  const handleDeleteOnClick = (): void => {
    setShowDeleteConfirmation(true)
  }

  const handleCancelOnClick = (): void => {
    setIsEditingDetails(false)

    if (workspace !== null && workspace !== undefined && !isCreation) {
      setWorkspaceDescription(workspace.description !== null ? workspace.description : '')
    } else {
      setWorkspaceDescription('')
      cancelCallback()
    }
  }

  const handleSaveOnClick = async (): Promise<void> => {
    if (workspaceDescription === null) {
      return
    }

    if (isCreation) {
      const newWorkspace = {
        name: NEW_WORKSPACE_NAME,
        description: workspaceDescription
      }

      setIsCreating(true)
      void workspaceOperations.createWorkspace(newWorkspace, dispatch)
    } else if (workspace !== undefined && workspace !== null) {
      const newWorkspace = { ...workspace }

      newWorkspace.description = workspaceDescription

      void workspaceOperations.updateWorkspace(newWorkspace, dispatch)
    }

    setIsAfterPersist(true)
    setIsLoading(true)
  }

  const handleConfirmDeleteOnClick = (): void => {
    if (workspace === undefined || workspace === null || workspace.id === undefined) {
      return
    }

    void workspaceOperations.deleteWorkspace(workspace.id, dispatch)
    setIsLoading(true)
  }

  const handleCancelDeleteOnClick = (): void => {
    setShowDeleteConfirmation(false)
  }

  const renderEditButton = (): ReactElement | null => {
    if (isLoading || isEditingDetails) {
      return null
    }

    return (
      <ButtonsComponent>
        <EditImageContainer>
          <Tooltip text={'Editar'}>
            <FontAwesomeIconButton icon={faPenToSquare} size="1x" onClick={handleEditOnClick} dataTestId={'edit-workspace-button'} />
          </Tooltip>
        </EditImageContainer>

        <EditImageContainer>
          <Tooltip text={'Deletar'}>
            <FontAwesomeIconButton icon={faTrash} size="1x" onClick={handleDeleteOnClick} dataTestId={'delete-workspace-button'} />
          </Tooltip>
        </EditImageContainer>
      </ButtonsComponent>
    )
  }

  const renderDeleteConfirmationDialog = (): ReactElement => {
    return (
      <Dialog
        dataTestId={'delete-workspace-dialog'}
        title={'Delete workspace'}
        show={showDeleteConfirmation}
        onOkClick={handleConfirmDeleteOnClick}
        onCancelClick={handleCancelDeleteOnClick}>
        <div>
          Essa ação não pode ser revertida.
          Deseja deletar o worspace {workspace?.name} ?
        </div>
      </Dialog>
    )
  }

  const renderButtons = (): ReactElement | null => {
    if (isLoading) {
      return <CircularProgress dataTestId='new-workspace-component-header-progress' />
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
            title='Description'
            type='text-area'
            fillWidth
            onChange={setWorkspaceDescription}
            value={workspaceDescription}
            edit={isEditingDetails}
            dataTestId='create-workspace-component-description'
            onDoubleClick={descriptionOnDoubleClick} />

          {renderButtons()}
        </InputsComponent>

        {renderEditButton()}
      </InputsContainer>
    )
  }

  return (
    <>
      {renderInputs()}
      {renderDeleteConfirmationDialog()}
    </>
  )
}

export default WorkspaceHeaderComponent
