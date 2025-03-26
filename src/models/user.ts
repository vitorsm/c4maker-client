import Diagram from './diagram'

export enum UserPermission {
  VIEW,
  EDIT
}

export interface UserAccess {
  diagram: Diagram
  permission: UserPermission
}

export interface LoginToken {
  accessToken: string
}

export default interface User {
  id?: string
  name: string
  login: string
  password?: string
  sharedDiagrams?: UserAccess[]
}
