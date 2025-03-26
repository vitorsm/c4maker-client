import User from './user'

export default interface GenericEntity {
  createdBy?: User | null
  modifiedBy?: User | null
  createdAt?: Date | null
  modifiedAt?: Date | null
}
