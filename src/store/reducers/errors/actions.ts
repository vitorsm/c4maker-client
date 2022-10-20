import GenericError from '../../../models/generic_error'
import { ErrorTypes } from './types'

export const setError = (error: GenericError): any => ({
  type: ErrorTypes.SET_ERROR,
  payload: error
})
