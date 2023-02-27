import { Reducer } from 'redux'
import ObjectWrapper, { generateEmptyObject } from '../../../models/object_wrapper'
import User, { LoginToken } from '../../../models/user'

export enum UserTypes {
  SET_AUTHENTICATE = '@user/SET_AUTHENTICATE',
  SET_CREATED = '@user/SET_CREATED',
  SET_CURRENT_USER = '@user/SET_CURRENT_USER'
}

export interface UserState {
  readonly tokenData: ObjectWrapper<LoginToken>
  readonly createdUser: ObjectWrapper<User>
  readonly currentUser: ObjectWrapper<User>
}

const INITIAL_STATE: UserState = {
  tokenData: generateEmptyObject(),
  createdUser: generateEmptyObject(),
  currentUser: generateEmptyObject()
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
