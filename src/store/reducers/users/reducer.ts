import { Reducer } from 'redux'
import { UserState, UserTypes } from './types'

const INITIAL_STATE: UserState = {
  tokenData: undefined,
  createdUser: undefined
}

const reducer: Reducer<UserState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserTypes.SET_AUTHENTICATE:
      return {
        ...state,
        tokenData: action.payload
      }
    case UserTypes.SET_CREATED:
      return {
        ...state,
        createdUser: action.payload
      }
    case UserTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload
      }
    default:
      return state
  }
}

export default reducer
