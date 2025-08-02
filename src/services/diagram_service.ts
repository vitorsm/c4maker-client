import { Dispatch } from 'react'
import Diagram, { DiagramItem } from '../models/diagram'
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

  createDiagramItem = (diagramItem: DiagramItem, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    this.postOrPut('diagram-item', diagramItem, dispatch, typeToDispatch)
  }

  updateDiagramItem = (diagramItem: DiagramItem, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    if (diagramItem.id == null) {
      return
    }

    this.postOrPut(`diagram-item/${diagramItem.id}`, diagramItem, dispatch, typeToDispatch, null, 'PUT')
  }

  deleteDiagramItem = (diagramItem: DiagramItem, dispatch: Dispatch<any>, typeToDispatch: string): void => {
    if (diagramItem.id == null) {
      return
    }

    return this.delete(`diagram-item/${diagramItem.id}`, dispatch, typeToDispatch, diagramItem.id)
  }
}
