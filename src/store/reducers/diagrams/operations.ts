import { Dispatch } from 'react'
import Diagram from '../../../models/diagram'
import DiagramService from '../../../services/diagram_service'
import { DiagramsTypes } from './types'

export const fetchUserDiagrams = async (dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().getDiagrams(dispatch, DiagramsTypes.GET_USER_DIAGRAMS)
}

export const fetchDiagram = async (diagramId: string, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().getDiagram(diagramId, dispatch, DiagramsTypes.GET_DIAGRAM)
}

export const createDiagram = async (diagram: Diagram, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().createDiagram(diagram, dispatch, DiagramsTypes.GET_DIAGRAM)
}
