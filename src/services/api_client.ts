import { Dispatch } from 'react'
import ObjectWrapper from '../models/object_wrapper'

const serverURL = 'http://localhost:5000/'

export default class APIClient<Type> {
  apiAddress: string

  constructor (apiAddress: string = serverURL) {
    this.apiAddress = apiAddress
  }

  post = (
    endpoint: string,
    data: any,
    dispatch: Dispatch<any>,
    typeToDispatch: string
  ): void => {
    const address = this.getAddress(endpoint)
    const headers = { 'Content-Type': 'application/json' }
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }

    fetch(address, requestOptions).then(
      async (response) => dispatch(this.dispatchFunction(typeToDispatch, { data: await response.json(), error: false })),
      () => dispatch(this.dispatchFunction(typeToDispatch, { data: null, error: true }))
    )
  }

  getAddress (endpoint: string): string {
    return this.apiAddress + endpoint
  }

  dispatchFunction = (type: string, payload: ObjectWrapper<Type>): any => ({
    type,
    payload
  })
}
