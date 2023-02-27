import GenericEntity from './generic'

export enum WorkspaceItemType {
  ENTITY,
  PERSONA,
  DATABASE,
  CONTAINER,
  COMPONENT
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
  itemType: WorkspaceItemType
}
