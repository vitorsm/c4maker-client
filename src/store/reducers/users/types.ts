import ObjectWrapper from '../../../models/object_wrapper'
import User, { LoginToken } from '../../../models/user'

export enum UserTypes {
  SET_AUTHENTICATE = '@user/SET_AUTHENTICATE',
  SET_CREATED = '@user/SET_CREATED'
}

export interface UserState {
  readonly tokenData?: ObjectWrapper<LoginToken>
  readonly createdUser?: ObjectWrapper<User>
}
