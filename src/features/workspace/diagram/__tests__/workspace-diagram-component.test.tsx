import React from 'react'
import { setupServer } from 'msw/lib/node'
import { assertDiagramList, closeNewDiagramDialog, createNewDiagram, generateDiagramsMock, generateWorkspaceMock, mockCreateDiagram, mockListDiagrams, openNewDiagramDialog, searchByDiagram } from './test_utils.workspace-diagram'
import { renderWithProvideres } from '../../../../utils/test-utils'
import { MemoryRouter } from 'react-router-dom'
import WorkspaceDiagramComponent from '../workspace-diagram-component'
import { DiagramType } from '../../../../models/diagram'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('test list workspace diagrams', async () => {
  const workspace = generateWorkspaceMock()
  const workspaceId = workspace.id
  const diagramList = generateDiagramsMock(3)
  const diagramNames = diagramList.map(diagram => diagram.name)
  const mockParameters = {
    workspace,
    diagramList
  }

  await mockListDiagrams(server, mockParameters)

  renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><WorkspaceDiagramComponent workspace={workspace} /></MemoryRouter>)

  await assertDiagramList(diagramNames)
})

test('test open new diagram dialog and close', async () => {
  const workspace = generateWorkspaceMock()
  const workspaceId = workspace.id
  const mockParameters = {
    workspace,
    diagramList: []
  }

  await mockListDiagrams(server, mockParameters)

  renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><WorkspaceDiagramComponent workspace={workspace} /></MemoryRouter>)

  await openNewDiagramDialog()
  await closeNewDiagramDialog()
})

test('test create new diagram', async () => {
  const workspace = generateWorkspaceMock()
  const workspaceId = workspace.id
  const mockParameters = {
    workspace,
    diagramList: []
  }
  const newDiagramName = 'new diagram'
  const newDiagramDescription = 'new diagram - description'
  const newDiagramType = DiagramType.C4
  const createdDiagram = {
    id: 'new_diagram_id',
    name: newDiagramName,
    description: newDiagramDescription,
    diagramType: newDiagramType,
    workspace
  }
  await mockListDiagrams(server, mockParameters)
  await mockCreateDiagram(server, createdDiagram)

  renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><WorkspaceDiagramComponent workspace={workspace} /></MemoryRouter>)

  await openNewDiagramDialog()
  await createNewDiagram(newDiagramName, newDiagramDescription, newDiagramType)
})

test('test search diagram', async () => {
  const workspace = generateWorkspaceMock()
  const workspaceId = workspace.id
  const diagramList = generateDiagramsMock(3)
  const diagramNames = diagramList.map(diagram => diagram.name)
  const mockParameters = {
    workspace,
    diagramList
  }

  await mockListDiagrams(server, mockParameters)

  renderWithProvideres(<MemoryRouter initialEntries={[`/workspaces/${workspaceId}`]}><WorkspaceDiagramComponent workspace={workspace} /></MemoryRouter>)

  await assertDiagramList(diagramNames)

  await searchByDiagram(diagramList[1].name)
  await assertDiagramList([diagramList[1].name], false)
})
