import { Dispatch } from 'react'
import Workspace from '../../../models/workspace'
import WorkspaceService from '../../../services/workspace_service'
import { WorkspaceTypes } from './reducer'

export const createWorkspace = async (workspace: Workspace, dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().createWorkspace(workspace, dispatch, WorkspaceTypes.GET_USER_WORKSPACE)
}

export const updateWorkspace = async (workspace: Workspace, dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().updateWorkspace(workspace, dispatch, WorkspaceTypes.GET_USER_WORKSPACE)
}

export const deleteWorkspace = async (workspaceId: string, dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().deleteWorkspace(workspaceId, dispatch, WorkspaceTypes.DELETE_WORKSPACE)
}

export const fetchUserWorkspaces = async (dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().getWorkspaces(dispatch, WorkspaceTypes.GET_USER_WORKSPACES)
}

export const fetchWorkspace = async (workspaceId: string, dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().getWorkspace(workspaceId, dispatch, WorkspaceTypes.GET_USER_WORKSPACE)
}

export const fetchItemsByWorkspace = async (workspaceId: string, dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().getItemsByWorkspace(workspaceId, dispatch, WorkspaceTypes.GET_WORKSPACE_ITEMS)
}

export const updateWorkspacesList = async (workspaces: Workspace[], dispatch: Dispatch<any>): Promise<void> => {
  dispatch({
    type: WorkspaceTypes.GET_USER_WORKSPACES,
    payload: { data: workspaces, error: false, errorMessage: null }
  })
}
