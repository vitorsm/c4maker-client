import { Dispatch } from 'react'
import Diagram from '../models/diagram'
import APIClient from './api_client'

export default class DiagramService extends APIClient<Diagram> {
  getDiagram = (diagramId: string, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get(`diagram/${diagramId}`, dispatch, typeToDispatch)
  }

  createDiagram = (diagram: Diagram, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.postOrPut('diagram', diagram, dispatch, typeToDispatch)
  }

  updateDiagram = (diagram: Diagram, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    if (diagram.id === undefined || diagram.id === null) {
      return
    }

    this.postOrPut(`diagram/${diagram.id}`, diagram, dispatch, typeToDispatch, null, 'PUT')
  }

  getItemsByDiagram = (diagramId: string, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.get(`diagram/${diagramId}/diagram-items`, dispatch, typeToDispatch)
  }
}
