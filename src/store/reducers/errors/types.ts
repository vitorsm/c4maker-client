import GenericError from '../../../models/generic_error'

export enum ErrorTypes {
  SET_ERROR = '@error/SET_ERROR'
}

export interface ErrorState {
  readonly error?: GenericError
}
