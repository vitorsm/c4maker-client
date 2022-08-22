import { Dispatch } from 'react'
import User from '../../../models/user'
import UserService from '../../../services/user_service'
import { UserTypes } from './types'

export const createUser = async (user: User, dispatch: Dispatch<any>): Promise<void> => {
  new UserService().createUser(user, dispatch, UserTypes.SET_CREATED)
}

export const authenticate = async (login: string, password: string, dispatch: Dispatch<any>): Promise<void> => {
  new UserService().authenticate(login, password, dispatch, UserTypes.SET_AUTHENTICATE)
}
