import { SetupServerApi } from 'msw/lib/node'
import Diagram, { DiagramType } from '../../../../models/diagram'
import { rest } from 'msw'
import Workspace from '../../../../models/workspace'
import { fireEvent, screen, waitFor } from '@testing-library/react'

const DIAGRAM_COMPONENT_TEST_ID = 'list-diagram-card-'
const LOADING_DIAGRAMS_TEST_ID = 'workspace-diagram-progress'
const NEW_DIAGRAM_BUTTON_TEST_ID = 'create-workspace-diagram-button'
const SEARCH_DIAGRAM_TEST_ID = 'search-diagrams-text-input'

const NEW_DIAGRAM_DIALOG_TEST_ID = 'new-diagram-dialog'
const NEW_DIAGRAM_DIALOG_CANCEL_TEST_ID = `${NEW_DIAGRAM_DIALOG_TEST_ID}-dialog-cancel-btn`
const NEW_DIAGRAM_DIALOG_OK_TEST_ID = `${NEW_DIAGRAM_DIALOG_TEST_ID}-dialog-ok-btn`
const NEW_DIAGRAM_LOADING_TEST_ID = 'new-diagram-loading'

const NEW_DIAGRAM_INPUT_NAME_TEST_ID = 'new-diagram-name'
const NEW_DIAGRAM_INPUT_DESCRIPTION_TEST_ID = 'new-diagram-description'
const NEW_DIAGRAM_INPUT_TYPE_TEST_ID = 'new-diagram-type-select'

export interface DiagramMockServerParameters {
  diagramList: Diagram[]
  workspace: Workspace
}

export const generateWorkspaceMock = (): Workspace => {
  return {
    id: 'workspace_id',
    name: 'workspace_name',
    description: 'description'
  }
}

export const generateDiagramsMock = (numberOfDiagrams: number, workspaceToUse?: Workspace): Diagram[] => {
  const workspace = workspaceToUse != null ? workspaceToUse : generateWorkspaceMock()

  const result = []
  for (let index = 0; index <= numberOfDiagrams; index++) {
    result.push({
      id: `id_${index}`,
      name: `name_${index}`,
      diagramType: DiagramType.C4,
      workspace,
      description: 'description'
    })
  }

  return result
}

export const mockListDiagrams = (server: SetupServerApi, parameters: DiagramMockServerParameters): void => {
  server.use(rest.get(`http://localhost:5000/workspace/${parameters.workspace.id}`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(parameters.workspace), ctx.delay(50))
  }))

  server.use(rest.get(`http://localhost:5000/workspace/${parameters.workspace.id}/diagrams`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(parameters.diagramList), ctx.delay(50))
  }))
}

export const mockCreateDiagram = (server: SetupServerApi, diagram: Diagram): void => {
  server.use(rest.post('http://localhost:5000/diagram', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(diagram), ctx.delay(50))
  }))
}

export const assertDiagramList = async (diagramNames: string[], checkLoading: boolean = true): Promise<void> => {
  if (checkLoading) {
    await waitFor(() => {
      expect(screen.getByTestId(LOADING_DIAGRAMS_TEST_ID)).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.queryByTestId(LOADING_DIAGRAMS_TEST_ID)).not.toBeInTheDocument()
    })
  }

  diagramNames.forEach((diagramName, index) => {
    const digramComponentTestId = `${DIAGRAM_COMPONENT_TEST_ID}${index}`
    const cardDescriptionTestId = `description-container-${digramComponentTestId}`
    expect(screen.getByTestId(cardDescriptionTestId)).toHaveTextContent(diagramName)
  })
}

export const openNewDiagramDialog = async (): Promise<void> => {
  const newDiagramButton = screen.getByTestId(NEW_DIAGRAM_BUTTON_TEST_ID)

  fireEvent.click(newDiagramButton)

  await waitFor(() => {
    expect(screen.getByTestId(NEW_DIAGRAM_DIALOG_TEST_ID)).toBeVisible()
  })
}

export const closeNewDiagramDialog = async (): Promise<void> => {
  const newDiagramDialogCancelButton = screen.getByTestId(NEW_DIAGRAM_DIALOG_CANCEL_TEST_ID)

  fireEvent.click(newDiagramDialogCancelButton)

  await waitFor(() => {
    expect(screen.getByTestId(NEW_DIAGRAM_DIALOG_TEST_ID)).not.toBeVisible()
  })
}

export const createNewDiagram = async (name: string, description: string, diagramType: DiagramType): Promise<void> => {
  const nameComponent = screen.getByTestId(NEW_DIAGRAM_INPUT_NAME_TEST_ID)
  const descriptionComponent = screen.getByTestId(NEW_DIAGRAM_INPUT_DESCRIPTION_TEST_ID)
  const inputComponent = screen.getByTestId(NEW_DIAGRAM_INPUT_TYPE_TEST_ID)
  const okButtonComponent = screen.getByTestId(NEW_DIAGRAM_DIALOG_OK_TEST_ID)

  fireEvent.change(nameComponent, { target: { value: name } })
  fireEvent.change(descriptionComponent, { target: { value: description } })
  fireEvent.change(inputComponent, { target: { value: diagramType } })

  fireEvent.click(okButtonComponent)

  await waitFor(() => {
    expect(screen.queryByTestId(NEW_DIAGRAM_LOADING_TEST_ID)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId(NEW_DIAGRAM_LOADING_TEST_ID)).not.toBeInTheDocument()
  })
}

export const searchByDiagram = async (diagramName: string): Promise<void> => {
  const searchDiagramComponent = screen.getByTestId(SEARCH_DIAGRAM_TEST_ID)

  fireEvent.change(searchDiagramComponent, { target: { value: diagramName } })
}

test('only to avoid error', () => {})
