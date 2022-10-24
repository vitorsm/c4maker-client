import Diagram from '../../../models/diagram'
import ObjectWrapper from '../../../models/object_wrapper'

export enum DiagramsTypes {
  GET_USER_DIAGRAMS = '@diagrams/GET_USER_DIAGRAMS'
}

export interface DiagramsState {
  readonly diagrams?: ObjectWrapper<Diagram[]>
}
