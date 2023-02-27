import GenericEntity from './generic'
import Workspace, { WorkspaceItem } from './workspace'

export enum DiagramType {
  C4,
  SEQUENCE,
  TEXT
}

export default interface Diagram extends GenericEntity {
  id?: string
  name: string
  diagramType: DiagramType
  workspace: Workspace
  description: string | null
}

export interface DiagramItemRelationship {
  diagramItem: DiagramItem
  description: string
  details: string
  fromPosition: DiagramItemPosition
  toPosition: DiagramItemPosition
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
  canvasData: DiagramItemCanvasData
  isSelected?: boolean | undefined
}
