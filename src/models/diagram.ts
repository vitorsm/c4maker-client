import GenericEntity from './generic'

export enum DiagramItemType {
  PERSON,
  SOFTWARE_SYSTEM,
  CONTAINER,
  COMPONENT
}

export default interface Diagram extends GenericEntity {
  id?: string
  name: string
  description: string | null
}

export interface DiagramItemRelationship {
  diagramItem: DiagramItem
  description: string
  details: string
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
  name: string
  itemDescription: string
  details: string
  itemType: DiagramItemType
  diagram: Diagram | null
  parent: DiagramItem | null
  relationships: DiagramItemRelationship[]
  canvasData: DiagramItemCanvasData
  isSelected?: boolean | undefined
}
