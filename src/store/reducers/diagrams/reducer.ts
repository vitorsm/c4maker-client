import { Reducer } from 'redux'
import { DiagramsState, DiagramsTypes } from './types'

const INITIAL_STATE: DiagramsState = {
  diagrams: undefined
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
    default:
      return state
  }
}

export default reducer
