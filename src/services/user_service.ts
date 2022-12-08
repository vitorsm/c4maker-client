import { Dispatch } from 'react'
import User from '../models/user'
import APIClient from './api_client'

export default class UserService extends APIClient<User> {
  createUser = (user: User, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.postOrPut('user', user, dispatch, typeToDispatch)
  }

  authenticate = (login: string, password: string, dispatch: Dispatch<any>, typeToDispatch: string, saveTokenFunc: Function): void => {
    const loginData = {
      username: login,
      password
    }

    this.postOrPut('api/auth/authenticate', loginData, dispatch, typeToDispatch, saveTokenFunc)
  }

  getCurrentUser = (dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get('user/me', dispatch, typeToDispatch)
  }
}
