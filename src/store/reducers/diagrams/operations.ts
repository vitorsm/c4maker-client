import { Dispatch } from 'react'
import Diagram from '../../../models/diagram'
import DiagramService from '../../../services/diagram_service'
import WorkspaceService from '../../../services/workspace_service'
import { DiagramsTypes } from './reducer'

export const fetchDiagramsByWorkspace = async (workspaceId: string, dispatch: Dispatch<any>): Promise<void> => {
  new WorkspaceService().getDiagramsByWorkspae(workspaceId, dispatch, DiagramsTypes.GET_USER_DIAGRAMS)
}

export const fetchDiagram = async (diagramId: string, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().getDiagram(diagramId, dispatch, DiagramsTypes.GET_DIAGRAM)
}

export const createDiagram = async (diagram: Diagram, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().createDiagram(diagram, dispatch, DiagramsTypes.PERSIST_DIAGRAM)
}

export const updateDiagram = async (diagram: Diagram, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().updateDiagram(diagram, dispatch, DiagramsTypes.PERSIST_DIAGRAM)
}
