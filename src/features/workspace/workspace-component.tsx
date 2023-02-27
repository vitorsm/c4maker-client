import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedContainer from '../../components/animated-container'
import CircularProgress from '../../components/circular-progress'
import DiagramItemsComponent from '../../components/diagram-items-component'
import { DiagramItem } from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import Workspace from '../../models/workspace'
import { RootState } from '../../store/reducers'
import { workspaceOperations } from '../../store/reducers/workspaces'
import WorkspaceHeaderComponent from './workspace-header-component'

const WorkspaceComponent: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { workspaceId } = useParams()

  const loadedWorkspace: ObjectWrapper<Workspace> = useSelector((state: RootState) => state.workspaceReducer.workspace)
  const persistedWorkspace: ObjectWrapper<Workspace> = useSelector((state: RootState) => state.workspaceReducer.persistedWorkspace)
  const workspaces: ObjectWrapper<Workspace[]> = useSelector((state: RootState) => state.workspaceReducer.workspaces)

  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [workspace, setWorkspace] = useState(loadedWorkspace.data)
  const [diagramItems, setDiagramItems] = useState<DiagramItem[]>([])

  const shouldRequestWorkspace = (): boolean => {
    return workspaceId !== undefined && loadedWorkspace.data?.id !== workspaceId && !loadedWorkspace?.error
  }

  useEffect(() => {
    if (workspaceId === undefined && workspaceId !== null) {
      setIsCreating(true)
    } else {
      setIsCreating(false)
    }

    if (shouldRequestWorkspace() && workspaceId !== undefined) {
      void workspaceOperations.fetchWorkspace(workspaceId, dispatch)
      setIsLoading(true)
    }
  })

  useEffect(() => {
    if (loadedWorkspace !== undefined) {
      setIsLoading(false)
      setWorkspace(loadedWorkspace.data)
    }
  }, [loadedWorkspace])

  useEffect(() => {
    if (persistedWorkspace !== undefined) {
      setIsLoading(false)

      if (!persistedWorkspace.error) {
        setWorkspace(persistedWorkspace.data)

        if (isCreating && ((persistedWorkspace?.data?.id) != null)) {
          navigate(`/workspaces/${persistedWorkspace?.data?.id}`)
        }
      }
    }
  }, [persistedWorkspace])

  const afterPersistWorkspace = (): void => {
    updateWorkspacesListByPersistedWorkspace()
  }

  const updateWorkspacesListByPersistedWorkspace = (): void => {
    const persistedWorkspaceOnState = workspaces.data?.find(w => w.id === persistedWorkspace.data?.id)

    let newWorkspaces: Workspace[]
    if (persistedWorkspaceOnState === undefined) {
      newWorkspaces = workspaces.data !== null ? [...workspaces.data] : []
      newWorkspaces = persistedWorkspace.data !== null ? [...newWorkspaces, persistedWorkspace.data] : []
    } else {
      newWorkspaces = workspaces.data?.map(w => {
        if (persistedWorkspace.data !== null && w.id === persistedWorkspace.data.id) {
          return persistedWorkspace.data
        }
        return w
      }) ?? []
    }

    void workspaceOperations.updateWorkspacesList(newWorkspaces, dispatch)
  }

  const handleCancelOnClick = (): void => {
    if (isCreating) {
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
        <CircularProgress />
      )
    }

    return (
      <>
        <WorkspaceHeaderComponent
          workspace={workspace}
          isCreating={isCreating}
          cancelCallback={handleCancelOnClick}
          closeCallback={handleOnCloseCallback}
          isLoadingWorkspace={isLoading}
          persistedWorkspaceCallback={afterPersistWorkspace} />

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
