import { Dispatch } from 'react'
import ObjectWrapper from '../models/object_wrapper'
import { ErrorTypes } from '../store/reducers/errors/types'
import { getToken, setToken } from '../store/token_utils'

const serverURL = 'http://localhost:5000/'
const MESSAGE_ATTRIBUTE_NAME = ['message', 'description']
const GENERIC_ERROR_MESSAGE = 'Internal error'

export default class APIClient<Type> {
  apiAddress: string

  constructor (apiAddress: string = serverURL) {
    this.apiAddress = apiAddress
  }

  get = (endpoint: string,
    dispatch: Dispatch<any>,
    typeToDispatch: string,
    successFunctionCallback: Function | null = null): void => {
    const address = this.getAddress(endpoint)
    const headers = this.getAuthenticatedHeader()
    const requestOptions = {
      method: 'GET',
      headers
    }

    fetch(address, requestOptions).then(
      async (response) => await this.handleRequestResponse(response, dispatch, typeToDispatch, successFunctionCallback),
      async () => await this.handleRequestResponse(null, dispatch, typeToDispatch, successFunctionCallback)
    )
  }

  post = (
    endpoint: string,
    data: any,
    dispatch: Dispatch<any>,
    typeToDispatch: string,
    successFunctionCallback: Function | null = null
  ): void => {
    const address = this.getAddress(endpoint)
    const headers = this.getAuthenticatedHeader()
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }

    fetch(address, requestOptions).then(
      async (response) => await this.handleRequestResponse(response, dispatch, typeToDispatch, successFunctionCallback),
      async () => await this.handleRequestResponse(null, dispatch, typeToDispatch, successFunctionCallback)
    )
  }

  handleRequestResponse = async (
    response: Response | null,
    dispatch: Dispatch<any>,
    typeToDispatch: string,
    successFunctionCallback: Function | null): Promise<void> => {
    const responseData = response !== null ? await response.json() : null

    if (response !== null && this.isSuccessStatus(response.status)) {
      dispatch(this.dispatchFunction(typeToDispatch, { data: responseData, error: false, errorMessage: null }))

      if (successFunctionCallback !== null) {
        successFunctionCallback(responseData)
      }
    } else {
      let message = null
      if (response !== null && this.isBadRequestError(response.status)) {
        message = this.getErrorMessage(responseData)
        if (this.isUnauthorized(response.status)) {
          this.unauthorizedCallback()
        }
      }

      dispatch(this.dispatchFunction(typeToDispatch, { data: null, error: true, errorMessage: message }))
      dispatch({ type: ErrorTypes.SET_ERROR, payload: { name: 'Error', description: message } })
    }
  }

  getAddress (endpoint: string): string {
    return this.apiAddress + endpoint
  }

  getAuthenticatedHeader = (): any => ({
    Authorization: getToken(),
    'Content-Type': 'application/json'
  })

  dispatchFunction = (type: string, payload: ObjectWrapper<Type>): any => ({
    type,
    payload
  })

  getErrorMessage = (responseData: any): string | null => {
    const message = MESSAGE_ATTRIBUTE_NAME.map(attr => responseData[attr]).find(value => value !== undefined && value !== null)
    return message === undefined ? GENERIC_ERROR_MESSAGE : message
  }

  unauthorizedCallback = (): void => {
    setToken(null)
  }

  isSuccessStatus = (statusCode: number): boolean => {
    return statusCode >= 200 && statusCode < 300
  }

  isBadRequestError = (statusCode: number): boolean => {
    return statusCode >= 400 && statusCode < 500
  }

  isUnauthorized = (statusCode: number): boolean => {
    return statusCode === 401
  }
}
