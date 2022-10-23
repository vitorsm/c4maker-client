import { Dispatch } from 'react'
import User, { LoginToken } from '../../../models/user'
import UserService from '../../../services/user_service'
import { setToken } from '../../token_utils'
import { UserTypes } from './types'

export const createUser = async (user: User, dispatch: Dispatch<any>): Promise<void> => {
  new UserService().createUser(user, dispatch, UserTypes.SET_CREATED)
}

export const authenticate = async (login: string, password: string, dispatch: Dispatch<any>): Promise<void> => {
  const setAuthenticationToken = (loginToken: LoginToken | null): void => {
    const token = loginToken !== null ? `Bearer ${loginToken.access_token}` : ''
    setToken(token)
  }

  new UserService().authenticate(login, password, dispatch, UserTypes.SET_AUTHENTICATE, setAuthenticationToken)
}

export const getCurrentUser = async (dispatch: Dispatch<any>): Promise<void> => {
  new UserService().getCurrentUser(dispatch, UserTypes.SET_CURRENT_USER)
}
