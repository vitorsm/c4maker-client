
export default interface ObjectWrapper<Type> {
  data: Type | null
  error: boolean
  errorMessage: string | null
}

export const generateEmptyObject = (): ObjectWrapper<any> => {
  return {
    data: null,
    error: false,
    errorMessage: null
  }
}
