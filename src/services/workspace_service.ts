import { Dispatch } from 'react'
import Workspace from '../models/workspace'
import APIClient from './api_client'

export default class WorkspaceService extends APIClient<Workspace> {
  getWorkspaces = (dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get('workspace', dispatch, typeToDispatch)
  }

  getWorkspace = (workspaceId: string, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get(`workspace/${workspaceId}`, dispatch, typeToDispatch)
  }

  createWorkspace = (workspace: Workspace, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.postOrPut('workspace', workspace, dispatch, typeToDispatch)
  }

  updateWorkspace = (workspace: Workspace, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    if (workspace.id === undefined || workspace.id === null) {
      return
    }

    this.postOrPut(`workspace/${workspace.id}`, workspace, dispatch, typeToDispatch, null, 'PUT')
  }

  getDiagramsByWorkspae = (workspaceId: string, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get(`workspace/${workspaceId}/diagrams`, dispatch, typeToDispatch)
  }

  getItemsByWorkspace = (workspaceId: string, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get(`workspace/${workspaceId}/workspace-items`, dispatch, typeToDispatch)
  }
}
