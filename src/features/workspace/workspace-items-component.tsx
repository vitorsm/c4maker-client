import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CircularProgress from '../../components/circular-progress'
import ObjectWrapper from '../../models/object_wrapper'
import Workspace, { WorkspaceItem } from '../../models/workspace'
import { RootState } from '../../store/reducers'
import { workspaceOperations } from '../../store/reducers/workspaces'
import { WorkspaceItemsContainer } from './style'

interface WorkspaceItemsComponentProps {
  workspace: Workspace | null
}

const WorkspaceItemsComponent: FC<WorkspaceItemsComponentProps> = ({ workspace }: WorkspaceItemsComponentProps) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const workspaceItems: ObjectWrapper<WorkspaceItem[]> = useSelector((rootState: RootState) => rootState.workspaceReducer.workspaceItems)

  useEffect(() => {
    fetchWorkspaceItems()
  }, [workspace])

  useEffect(() => {
    setIsLoading(false)
  }, [workspaceItems])

  const fetchWorkspaceItems = (): void => {
    if (workspace === null || workspace.id === null || workspace.id === undefined) {
      return
    }

    void workspaceOperations.fetchItemsByWorkspace(workspace.id, dispatch)
    setIsLoading(true)
  }

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress />
      )
    }

    return (
      <div>
        {workspaceItems?.data?.map(item => item.name + ', ')}
      </div>
    )
  }

  return (
    <WorkspaceItemsContainer>
      {renderContent()}
    </WorkspaceItemsContainer>
  )
}

export default WorkspaceItemsComponent
