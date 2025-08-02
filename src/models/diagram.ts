import GenericEntity from './generic'
import Workspace, { WorkspaceItem } from './workspace'

export enum DiagramType {
  C4 = 'C4',
  SEQUENCE = 'SEQUENCE',
  TEXT = 'TEXT'
}

export default interface Diagram extends GenericEntity {
  id?: string
  name: string
  diagramType: DiagramType | string
  workspace: Workspace
  description: string | null
}

export interface DiagramItemRelationshipData {
  fromPosition: DiagramItemPosition
  toPosition: DiagramItemPosition
}

export interface DiagramItemRelationship {
  diagramItem: DiagramItem
  description: string
  details: string
  data: DiagramItemRelationshipData
  diagramType: string
}

export interface DiagramItemPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface DiagramItemCanvasData {
  position: DiagramItemPosition | null
  color: string | null
}

export interface DiagramItem extends GenericEntity {
  id?: string
  workspaceItem: WorkspaceItem
  diagram: Diagram | null
  parent: DiagramItem | null
  relationships: DiagramItemRelationship[]
  data: DiagramItemCanvasData
  isSelected?: boolean | undefined
  diagramItemType?: string
}
