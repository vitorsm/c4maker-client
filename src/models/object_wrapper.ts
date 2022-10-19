
export default interface ObjectWrapper<Type> {
  data: Type | null
  error: boolean
  errorMessage: string | null
}
