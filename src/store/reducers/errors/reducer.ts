import { Reducer } from 'redux'
import { ErrorState, ErrorTypes } from './types'

const INITIAL_STATE: ErrorState = {
  error: undefined
}

const reducer: Reducer<ErrorState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ErrorTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}

export default reducer
