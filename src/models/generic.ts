import User from './user'

export default interface GenericEntity {
  created_by?: User | null
  modified_by?: User | null
  created_at?: Date | null
  modified_at?: Date | null
}
