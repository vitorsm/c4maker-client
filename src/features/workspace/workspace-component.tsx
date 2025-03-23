import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import AnimatedContainer from '../../components/animated-container'
import { BreadcrumbsItem, generateEmptyBreadcrumbs } from '../../components/breadcrumbs/breadcrumbs'
import CircularProgress from '../../components/circular-progress'
import DiagramItemsComponent from '../../components/diagram-items-component'
import { DiagramItem } from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'
import { workspaceOperations } from '../../store/reducers/workspaces'
import WorkspaceDiagramComponent from './diagram/workspace-diagram-component'
import { WorkspaceComponentBody } from './style'
import WorkspaceHeaderComponent from './workspace-header-component'
import DiagramComponent from '../diagram/diagram-component'
import useBreadcrumbs from '../../store/reducers/breadcrumbs/use-breadcrumbs'
import { updateItemInList } from '../../utils/list-utils'

export const NEW_WORKSPACE_NAME = 'New Workspace'

const WorkspaceComponent: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const resolvedPath = useResolvedPath('')

  const onBreadcrumbsItemUpdate = (breadcrumbsItem: BreadcrumbsItem): void => {
    if (currentBreadcrumbsItem.key === breadcrumbsItem.key) {
      updateWorkspaceName(breadcrumbsItem.name)
    }
  }

  const { addBreadcrumbItem } = useBreadcrumbs(onBreadcrumbsItemUpdate)

  const { workspaceId } = useParams()

  const loadedWorkspace: ObjectWrapper<Workspace> = useSelector((state: RootState) => state.workspaceReducer.workspace)
  const workspaces: ObjectWrapper<Workspace[]> = useSelector((state: RootState) => state.workspaceReducer.workspaces)

  const [isLoading, setIsLoading] = useState(false)
  const [isCreation, setIsCreation] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [workspace, setWorkspace] = useState(loadedWorkspace.data)
  const [diagramItems, setDiagramItems] = useState<DiagramItem[]>([])
  const [currentBreadcrumbsItem, setCurrentBreadcrumbsItems] = useState<BreadcrumbsItem>(generateEmptyBreadcrumbs(null, NEW_WORKSPACE_NAME))

  const shouldRequestWorkspace = (): boolean => {
    return workspaceId !== undefined && loadedWorkspace.data?.id !== workspaceId && !loadedWorkspace?.error
  }

  useEffect(() => {
    generateAndSetBreadcrumbsItems(getWorkspaceOrNull(workspace))
  }, [resolvedPath])

  useEffect(() => {
    if (workspaceId === undefined && workspaceId !== null) {
      setIsCreation(true)
      void workspaceOperations.cleanWorkspaceState(dispatch)
    } else {
      setIsCreation(false)
    }

    if (shouldRequestWorkspace() && workspaceId !== undefined) {
      void workspaceOperations.fetchWorkspace(workspaceId, dispatch)
      setIsLoading(true)
    }
  }, [])

  useEffect(() => {
    if (loadedWorkspace.data == null && !loadedWorkspace.error) {
      return
    }

    setIsLoading(false)

    if (!loadedWorkspace.error && loadedWorkspace.data !== null) {
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
  }, [loadedWorkspace])

  useEffect(() => {
    addBreadcrumbItem(currentBreadcrumbsItem, 2)
  }, [currentBreadcrumbsItem])

  const updateWorkspaceName = (workspaceName: string): void => {
    let workspaceToSave = getWorkspaceOrNull(workspace)
    const shouldCreate = workspaceToSave === null

    if (workspaceToSave === null) {
      workspaceToSave = {
        name: '',
        description: ''
      }
    }

    workspaceToSave.name = workspaceName

    if (shouldCreate) {
      setIsCreating(true)
      void workspaceOperations.createWorkspace(workspaceToSave, dispatch)
    } else {
      void workspaceOperations.updateWorkspace(workspaceToSave, dispatch)
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
      generateAndSetBreadcrumbsItems(null)
    } else {
      generateAndSetBreadcrumbsItems(currentWorkspace)
    }
  }

  const generateAndSetBreadcrumbsItems = (workspace: Workspace | null): void => {
    if (workspace === null) {
      setCurrentBreadcrumbsItems(generateEmptyBreadcrumbs(null, NEW_WORKSPACE_NAME))
    } else {
      const breadcrumbsItem = {
        key: workspace.id ?? '',
        name: workspace.name,
        details: workspace.description,
        onClick: () => navigate(`/workspaces/${workspace.id ?? ''}`),
        editable: true
      }

      setCurrentBreadcrumbsItems(breadcrumbsItem)
    }
  }

  const afterPersistWorkspace = (): void => {
    updateWorkspacesListByPersistedWorkspace()
  }

  const updateWorkspacesListByPersistedWorkspace = (): void => {
    const getWorkspaceId = (item: Workspace): string | undefined => item.id
    const newWorkspaces: any = updateItemInList(loadedWorkspace.data, workspaces.data, getWorkspaceId)

    void workspaceOperations.updateWorkspacesList(newWorkspaces, dispatch)
  }

  const handleCancelOnClick = (): void => {
    if (isCreation) {
      navigate(-1)
    }
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

  const renderInternalContent = (): ReactElement => {
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
          isLoadingWorkspace={isLoading}
          persistedWorkspaceCallback={afterPersistWorkspace}
          setIsCreating={setIsCreating} />

          <WorkspaceComponentBody>
            <WorkspaceDiagramComponent workspace={getWorkspace()} />
          </WorkspaceComponentBody>

          {false && (
            <DiagramItemsComponent
              diagramItems={diagramItems}
              onDiagramItemChange={onDiagramItemChange}
              onDiagramItemAdded={onDiagramItemAdded}
              onDiagramItemDeleted={onDiagramItemDeleted} />
          )}

      </>
    )
  }

  const renderContent = (): ReactElement => {
    return (
      <AnimatedContainer>
        {renderInternalContent()}
      </AnimatedContainer>
    )
  }

  return (
    <Routes>
      <Route path='diagram/:diagramId' element={<DiagramComponent />} />
      <Route path='' element={renderContent()} />
    </Routes>
  )
}

export default WorkspaceComponent
