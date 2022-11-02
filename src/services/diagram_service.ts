import { Dispatch } from 'react'
import Diagram from '../models/diagram'
import APIClient from './api_client'

export default class DiagramService extends APIClient<Diagram> {
  getDiagrams = (dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get('diagram', dispatch, typeToDispatch)
  }

  getDiagram = (diagramId: string, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get(`diagram/${diagramId}`, dispatch, typeToDispatch)
  }

  createDiagram = (diagram: Diagram, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.post('diagram', diagram, dispatch, typeToDispatch)
  }
}
