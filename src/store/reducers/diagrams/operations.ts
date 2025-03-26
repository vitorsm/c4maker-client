import { Dispatch } from 'react'
import Diagram, { DiagramItem } from '../../../models/diagram'
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
  new DiagramService().createDiagram(diagram, dispatch, DiagramsTypes.GET_DIAGRAM)
}

export const updateDiagram = async (diagram: Diagram, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().updateDiagram(diagram, dispatch, DiagramsTypes.GET_DIAGRAM)
}

export const fetchItemsByDiagram = async (diagramId: string, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().getItemsByDiagram(diagramId, dispatch, DiagramsTypes.DIAGRAM_ITEMS)
}

export const createDiagramItem = async (diagramItem: DiagramItem, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().createDiagramItem(diagramItem, dispatch, DiagramsTypes.GET_DIAGRAM_ITEM)
}

export const updateDiagramItem = async (diagramItem: DiagramItem, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().updateDiagramItem(diagramItem, dispatch, DiagramsTypes.GET_DIAGRAM_ITEM)
}

export const deleteDiagramItem = async (diagramItem: DiagramItem, dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().deleteDiagramItem(diagramItem, dispatch, DiagramsTypes.DELETE_DIAGRAM_ITEM)
}
