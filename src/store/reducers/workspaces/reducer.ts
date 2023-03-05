import { Reducer } from 'redux'
import ObjectWrapper, { generateEmptyObject } from '../../../models/object_wrapper'
import Workspace, { WorkspaceItem } from '../../../models/workspace'

export enum WorkspaceTypes {
  GET_USER_WORKSPACES = '@workspaces/GET_USER_WORKSPACES',
  GET_USER_WORKSPACE = '@workspaces/GET_USER_WORKSPACE',
  PERSIST_WORKSPACE = '@workspaces/PERSIST_WORKSPACE',
  GET_WORKSPACE_ITEMS = '@workspaces/GET_WORKSPACE_ITEMS',
  DELETE_WORKSPACE = '@worksapces/DELETE_WORKSPACE'
}

export interface WorkspaceState {
  workspaces: ObjectWrapper<Workspace[]>
  persistedWorkspace: ObjectWrapper<Workspace>
  workspace: ObjectWrapper<Workspace>
  workspaceItems: ObjectWrapper<WorkspaceItem[]>
  deletedWorkspace: ObjectWrapper<string>
}

const INITIAL_STATE: WorkspaceState = {
  workspaces: generateEmptyObject(),
  persistedWorkspace: generateEmptyObject(),
  workspace: generateEmptyObject(),
  workspaceItems: generateEmptyObject(),
  deletedWorkspace: generateEmptyObject()
}

const reducer: Reducer<WorkspaceState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WorkspaceTypes.GET_USER_WORKSPACES:
      return {
        ...state,
        workspaces: action.payload
      }
    case WorkspaceTypes.GET_USER_WORKSPACE:
      return {
        ...state,
        workspace: action.payload
      }
    case WorkspaceTypes.PERSIST_WORKSPACE:
      return {
        ...state,
        persistedWorkspace: action.payload
      }
    case WorkspaceTypes.GET_WORKSPACE_ITEMS:
      return {
        ...state,
        workspaceItems: action.payload
      }
    case WorkspaceTypes.DELETE_WORKSPACE:
      return {
        ...state,
        deletedWorkspace: action.payload
      }
    default:
      return state
  }
}

export default reducer
