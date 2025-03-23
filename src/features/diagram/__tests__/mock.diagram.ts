import Diagram, { DiagramType } from '../../../models/diagram'
import Workspace from '../../../models/workspace'
import { mockWorkspace } from '../../workspace/__tests__/mock.workspace'

export const mockDiagram = (
  id: string = 'diagram_id',
  name: string = 'Diagram',
  diagramType: DiagramType = DiagramType.C4,
  workspace: Workspace | null = mockWorkspace(),
  description: string | null = null
): Diagram => {
  if (workspace == null) {
    workspace = mockWorkspace()
  }

  return {
    id,
    name,
    workspace,
    description,
    diagram_type: diagramType
  }
}
