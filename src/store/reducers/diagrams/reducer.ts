import { Reducer } from 'redux'
import Diagram, { DiagramItem } from '../../../models/diagram'
import ObjectWrapper, { generateEmptyObject } from '../../../models/object_wrapper'

export enum DiagramsTypes {
  GET_USER_DIAGRAMS = '@diagrams/GET_USER_DIAGRAMS',
  GET_DIAGRAM = '@diagrams/GET_DIAGRAM',
  PERSIST_DIAGRAM = '@diagrams/PERSIST_DIAGRAM',
  DIAGRAM_ITEMS = '@diagrams/GET_DIAGRAM_ITEMS'
}

export interface DiagramsState {
  readonly diagrams: ObjectWrapper<Diagram[]>
  readonly diagram: ObjectWrapper<Diagram>
  readonly persistedDiagram: ObjectWrapper<Diagram>
  readonly diagramItems: ObjectWrapper<DiagramItem[]>
}

const INITIAL_STATE: DiagramsState = {
  diagrams: generateEmptyObject(),
  diagram: generateEmptyObject(),
  persistedDiagram: generateEmptyObject(),
  diagramItems: generateEmptyObject()
}

const reducer: Reducer<DiagramsState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DiagramsTypes.GET_USER_DIAGRAMS:
      return {
        ...state,
        diagrams: action.payload
      }
    case DiagramsTypes.GET_DIAGRAM:
      return {
        ...state,
        diagram: action.payload
      }
    case DiagramsTypes.PERSIST_DIAGRAM:
      return {
        ...state,
        persistedDiagram: action.payload
      }
    case DiagramsTypes.DIAGRAM_ITEMS:
      return {
        ...state,
        diagramItems: action.payload
      }
    default:
      return state
  }
}

export default reducer
