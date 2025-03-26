import GenericEntity from './generic'

export enum WorkspaceItemType {
  ENTITY = 'ENTITY',
  PERSONA = 'PERSONA',
  DATABASE = 'DATABASE',
  CONTAINER = 'CONTAINER',
  COMPONENT = 'COMPONENT'
}

export default interface Workspace extends GenericEntity {
  id?: string
  name: string
  description: string | null
}

export interface WorkspaceItem extends GenericEntity {
  id?: string
  name: string
  key: string
  description: string | null
  details: string | null
  workspace: Workspace | null
  workspaceItemType: WorkspaceItemType
}
