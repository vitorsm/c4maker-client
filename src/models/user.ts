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
  access_token: string
}

export default interface User {
  id?: string
  name: string
  login: string
  password?: string
  shared_diagrams?: UserAccess[]
}
