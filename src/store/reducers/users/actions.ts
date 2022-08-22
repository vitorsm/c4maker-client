import ObjectWrapper from '../../../models/object_wrapper'
import User, { LoginToken } from '../../../models/user'
import { UserTypes } from './types'

export const setCreatedUser = (user: ObjectWrapper<User>): any => ({
  type: UserTypes.SET_CREATED,
  payload: user
})

export const setAuthenticatedUser = (loginToken: ObjectWrapper<LoginToken>): any => ({
  type: UserTypes.SET_AUTHENTICATE,
  payload: loginToken
})
