import User from './user'

export default interface Diagram {
  id?: string
  name: string
  description: string | null
  created_by?: User | null
  modified_by?: User | null
  created_at?: Date | null
  modified_at?: Date | null
}
