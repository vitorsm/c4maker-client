import { Dispatch } from 'react'
import Diagram from '../models/diagram'
import APIClient from './api_client'

export default class DiagramService extends APIClient<Diagram> {
  getDiagrams = (dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get('diagram', dispatch, typeToDispatch)
  }
}
