import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedContainer from '../../components/animated-container'
import { BreadcrumbsItem } from '../../components/breadcrumbs/breadcrumbs'
import CircularProgress from '../../components/circular-progress'
import DiagramItemsComponent from '../../components/diagram-items-component'
import { DiagramItem } from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'
import { breadcrumbsOperations } from '../../store/reducers/breadcrumbs'
import { workspaceOperations } from '../../store/reducers/workspaces'
import WorkspaceHeaderComponent from './workspace-header-component'

export const NEW_WORKSPACE_NAME = 'New Workspace'

interface WorkspaceComponentProps {
  breadcrumbsItems: BreadcrumbsItem[]
}

const WorkspaceComponent: FC<WorkspaceComponentProps> = ({ breadcrumbsItems }: WorkspaceComponentProps) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { workspaceId } = useParams()

  const generateEmptyBreadcrumbs = (): BreadcrumbsItem => ({
    key: 'new_item',
    name: NEW_WORKSPACE_NAME,
    details: null,
    onClick: null,
    editable: true
  })

  const loadedWorkspace: ObjectWrapper<Workspace> = useSelector((state: RootState) => state.workspaceReducer.workspace)
  const workspaces: ObjectWrapper<Workspace[]> = useSelector((state: RootState) => state.workspaceReducer.workspaces)
  const updatedBreadcrumbsItem: BreadcrumbsItem | null = useSelector((state: RootState) => state.breadcrumbsReducer.updatedBreadcrumbsItem)

  const [isLoading, setIsLoading] = useState(false)
  const [isCreation, setIsCreation] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [workspace, setWorkspace] = useState(loadedWorkspace.data)
  const [diagramItems, setDiagramItems] = useState<DiagramItem[]>([])
  const [currentBreadcrumbsItem, setCurrentBreadcrumbsItems] = useState<BreadcrumbsItem>(generateEmptyBreadcrumbs())
  const [localBreadcrumbsItems, setLocalBreadcrumbsItems] = useState<BreadcrumbsItem[]>(breadcrumbsItems)

  const shouldRequestWorkspace = (): boolean => {
    return workspaceId !== undefined && loadedWorkspace.data?.id !== workspaceId && !loadedWorkspace?.error
  }

  useEffect(() => {
    if (workspaceId === undefined && workspaceId !== null) {
      setIsCreation(true)
    } else {
      setIsCreation(false)
    }

    if (shouldRequestWorkspace() && workspaceId !== undefined) {
      void workspaceOperations.fetchWorkspace(workspaceId, dispatch)
      setIsLoading(true)
    }
  })

  useEffect(() => {
    if (loadedWorkspace !== undefined) {
      setIsLoading(false)

      if (!loadedWorkspace.error) {
        handleSetWorkspace(loadedWorkspace.data)

        if (isUpdating || isCreation) {
          setIsUpdating(false)
          updateWorkspacesListByPersistedWorkspace()
        }

        if (isCreating && ((loadedWorkspace?.data?.id) != null)) {
          navigate(`/workspaces/${loadedWorkspace?.data?.id}`, {
            replace: true,
            state: undefined,
            preventScrollReset: undefined,
            relative: undefined // "route" | "path"
          })
        }
      }

      setIsCreating(false)
    }
  }, [loadedWorkspace, workspaceId])

  useEffect(() => {
    setLocalBreadcrumbsItems([...breadcrumbsItems, currentBreadcrumbsItem])
  }, [currentBreadcrumbsItem])

  useEffect(() => {
    breadcrumbsOperations.setBreadcrumbsItems(localBreadcrumbsItems, dispatch)
  }, [localBreadcrumbsItems])

  useEffect(() => {
    if (updatedBreadcrumbsItem !== null && currentBreadcrumbsItem.key === updatedBreadcrumbsItem.key) {
      updateWorkspaceName(updatedBreadcrumbsItem.name)
    }
  }, [updatedBreadcrumbsItem])

  const updateWorkspaceName = (workspaceName: string): void => {
    let workspace = getWorkspace()
    const shouldCreate = workspace === null

    if (workspace === null) {
      workspace = {
        name: '',
        description: ''
      }
    }

    // todo - this check is useless
    if (workspace === null) return

    workspace.name = workspaceName

    if (shouldCreate) {
      setIsCreating(true)
      void workspaceOperations.createWorkspace(workspace, dispatch)
    } else {
      void workspaceOperations.updateWorkspace(workspace, dispatch)
    }

    setIsLoading(true)
    setIsUpdating(true)
  }

  const getWorkspaceOrNull = (currentWorkspace: Workspace | null): Workspace | null => {
    if (currentWorkspace === null) {
      return null
    }

    if (workspaceId === undefined || workspaceId === null) {
      return null
    }

    if (workspaceId !== currentWorkspace.id) {
      return null
    }

    return currentWorkspace
  }

  const getWorkspace = (): Workspace | null => {
    return getWorkspaceOrNull(workspace)
  }

  const handleSetWorkspace = (workspace: Workspace | null): void => {
    setWorkspace(workspace)

    const currentWorkspace = getWorkspaceOrNull(workspace)
    if (currentWorkspace === null) {
      setCurrentBreadcrumbsItems(generateEmptyBreadcrumbs())
      return
    }

    const breadcrumbsItem = {
      key: currentWorkspace.id ?? '',
      name: currentWorkspace.name,
      details: currentWorkspace.description,
      onClick: null,
      editable: true
    }

    setCurrentBreadcrumbsItems(breadcrumbsItem)
  }

  const afterPersistWorkspace = (): void => {
    updateWorkspacesListByPersistedWorkspace()
  }

  const updateWorkspacesListByPersistedWorkspace = (): void => {
    const persistedWorkspaceOnState = workspaces.data?.find(w => w.id === loadedWorkspace.data?.id)

    let newWorkspaces: Workspace[]
    if (persistedWorkspaceOnState === undefined) {
      newWorkspaces = workspaces.data !== null ? [...workspaces.data] : []
      newWorkspaces = loadedWorkspace.data !== null ? [...newWorkspaces, loadedWorkspace.data] : []
    } else {
      newWorkspaces = workspaces.data?.map(w => {
        if (loadedWorkspace.data !== null && w.id === loadedWorkspace.data.id) {
          return loadedWorkspace.data
        }
        return w
      }) ?? []
    }

    void workspaceOperations.updateWorkspacesList(newWorkspaces, dispatch)
  }

  const handleCancelOnClick = (): void => {
    if (isCreation) {
      navigate(-1)
    }
  }

  const handleOnCloseCallback = (): void => {
    navigate(-1)
  }

  const onDiagramItemChange = (newDiagramItems: DiagramItem[]): void => {
    const diagramItemKeys = newDiagramItems.map(diagramItem => diagramItem.workspaceItem.key)

    const persistedDiagramMap = new Map()
    diagramItems.filter(diagramItem => diagramItemKeys.includes(diagramItem.workspaceItem.key)).forEach(diagramItem => {
      persistedDiagramMap.set(diagramItem.workspaceItem.key, diagramItem)
    })

    newDiagramItems.forEach(newDiagramItem => {
      const diagramItem = persistedDiagramMap.get(newDiagramItem.workspaceItem.key)

      diagramItem.canvasData = newDiagramItem.canvasData
      diagramItem.isSelected = newDiagramItem.isSelected
      diagramItem.workspaceItem = newDiagramItem.workspaceItem
    })

    setDiagramItems([...diagramItems])
  }

  const onDiagramItemAdded = (diagramItem: DiagramItem): void => {
    setDiagramItems([...diagramItems, diagramItem])
  }
  const onDiagramItemDeleted = (diagramItemsToDelete: DiagramItem[]): void => {
    const itemKeys = diagramItemsToDelete.map(diagramItem => diagramItem.workspaceItem.key)

    setDiagramItems(diagramItems.filter(diagramItem => !itemKeys.includes(diagramItem.workspaceItem.key)))
  }

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress dataTestId='workspace-component-progress' />
      )
    }

    return (
      <>
        <WorkspaceHeaderComponent
          workspace={getWorkspace()}
          isCreation={isCreation}
          cancelCallback={handleCancelOnClick}
          closeCallback={handleOnCloseCallback}
          isLoadingWorkspace={isLoading}
          persistedWorkspaceCallback={afterPersistWorkspace}
          setIsCreating={setIsCreating} />

          <DiagramItemsComponent
            diagramItems={diagramItems}
            onDiagramItemChange={onDiagramItemChange}
            onDiagramItemAdded={onDiagramItemAdded}
            onDiagramItemDeleted={onDiagramItemDeleted} />
      </>
    )
  }

  return (
    <AnimatedContainer>
      {renderContent()}
    </AnimatedContainer>
  )
}

export default WorkspaceComponent
