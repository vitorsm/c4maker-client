import Diagram from '../../../models/diagram'
import ObjectWrapper from '../../../models/object_wrapper'

export enum DiagramsTypes {
  GET_USER_DIAGRAMS = '@diagrams/GET_USER_DIAGRAMS',
  GET_DIAGRAM = '@diagrams/GET_DIAGRAM',
  PERSIST_DIAGRAM = '@diagrams/PERSIST_DIAGRAM'
}

export interface DiagramsState {
  readonly diagrams?: ObjectWrapper<Diagram[]>
  readonly diagram?: ObjectWrapper<Diagram>
  readonly persistedDiagram?: ObjectWrapper<Diagram>
}
