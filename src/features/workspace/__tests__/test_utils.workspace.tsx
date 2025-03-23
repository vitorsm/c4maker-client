import { waitFor, screen, fireEvent } from '@testing-library/react'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import Workspace from '../../../models/workspace'
import { SetupServerApi } from 'msw/lib/node'
import { rest } from 'msw'
import { mockLoadCurrentUser } from '../../../__tests__/test_utils'
import { mockDiagram } from '../../diagram/__tests__/mock.diagram'

export interface WorkspaceMockServerParameters {
  newWorkspaceReturn?: Workspace
  workspaceToUpdate?: Workspace
  workspaceList?: Workspace[] | null
  newWorkspaceName?: string
  newWorkspaceDescription?: string
  errorDescription?: string
}

export const assertAfterSaveWorkspace = async (store: any, newName: string | null, newDescription: string | null, errorDescription: string | null, fromHeader: boolean = false): Promise<void> => {
  const progressDataTestId = fromHeader ? 'new-workspace-component-header-progress' : 'workspace-component-progress'

  await waitFor(() => {
    expect(screen.queryByTestId(progressDataTestId)).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId(progressDataTestId)).not.toBeInTheDocument()

    if (newDescription != null) {
      expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent(newDescription)
    }

    if (newName != null) {
      expect(screen.queryByTestId(`${DEFAULT_BREADCRUMBS_TEST_ID}-text-link-1`)).toHaveTextContent(newName)
    }

    if (errorDescription == null) {
      expect(store.getState().errorReducer.error).toBeUndefined()
    } else {
      expect(store.getState().errorReducer.error.description).toEqual(errorDescription)
    }
  })
}

export const openWorkspaceComponentToCreate = async (): Promise<void> => {
  const newWorkspaceLinkDataId = 'workspace-empty-state-new-item-link'
  const descriptionTestId = 'create-workspace-component-description'
  const editButtonTestId = 'edit-workspace-button'
  const cancelButtonTestId = 'create-workspace-component-cancel-button'

  const newWorkspaceLinkComponent = screen.getByTestId(newWorkspaceLinkDataId)
  fireEvent.click(newWorkspaceLinkComponent)

  await waitFor(() => {
    expect(screen.queryByTestId(descriptionTestId)).toBeInTheDocument()
    expect(screen.queryByTestId(editButtonTestId)).not.toBeInTheDocument()
    expect(screen.queryByTestId(cancelButtonTestId)).toBeInTheDocument()
  })
}

export const openWorkspaceComponent = async (store: any, workspaceDescription: string, indexOfWorkspaceToOpen: number = 0): Promise<void> => {
  mockLoadCurrentUser(store)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-list-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-list-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId(`list-workspace-card-${indexOfWorkspaceToOpen}`)).toBeInTheDocument()
  })

  const workspaceCard = screen.getByTestId(`list-workspace-card-${indexOfWorkspaceToOpen}`)

  fireEvent.click(workspaceCard)

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('workspace-component-progress')).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent(workspaceDescription)
  })
}

export const mockServerForManagingWorkspace = (server: SetupServerApi, mockParameters: WorkspaceMockServerParameters, forcedWorkspaceId?: string): void => {
  let workspaceToReturn = null
  if (mockParameters.workspaceToUpdate?.id != null || forcedWorkspaceId != null) {
    workspaceToReturn = mockParameters.workspaceToUpdate
  } else if (mockParameters.newWorkspaceReturn?.id != null) {
    workspaceToReturn = mockParameters.newWorkspaceReturn
  }

  const diagrams = [mockDiagram(undefined, undefined, undefined, workspaceToReturn)]

  if (mockParameters.workspaceList !== undefined) {
    server.use(rest.get('http://localhost:5000/workspace', (req, res, ctx) => {
      return res(ctx.status(200), mockParameters.workspaceList === null ? null as any : ctx.json(mockParameters.workspaceList), ctx.delay(50))
    }))
  }

  if (mockParameters.errorDescription != null) {
    server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({ description: mockParameters.errorDescription }), ctx.delay(150))
    }))
  }

  if (workspaceToReturn != null && (workspaceToReturn.id != null || forcedWorkspaceId != null)) {
    const workspaceIdToMock = workspaceToReturn?.id != null ? workspaceToReturn.id : forcedWorkspaceId

    server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(workspaceToReturn), ctx.delay(50))
    }))
    server.use(rest.get(`http://localhost:5000/workspace/${workspaceIdToMock}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(workspaceToReturn), ctx.delay(50))
    }))
    server.use(rest.get(`http://localhost:5000/workspace/${workspaceIdToMock}/diagrams`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(diagrams), ctx.delay(150))
    }))
    server.use(rest.get(`http://localhost:5000/workspace/${workspaceIdToMock}/workspace-items`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]), ctx.delay(150))
    }))

    if (mockParameters.errorDescription != null) {
      server.use(rest.delete(`http://localhost:5000/workspace/${workspaceIdToMock}`, (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ description: mockParameters.errorDescription }), ctx.delay(50))
      }))
    } else {
      server.use(rest.delete(`http://localhost:5000/workspace/${workspaceIdToMock}`, (req, res, ctx) => {
        return res(ctx.status(204), null as any, ctx.delay(50))
      }))
    }
  }

  if (mockParameters.workspaceToUpdate?.id != null) {
    const newWorkspace = { ...mockParameters.workspaceToUpdate }
    if (mockParameters.newWorkspaceDescription != null) {
      newWorkspace.description = mockParameters.newWorkspaceDescription
    }
    if (mockParameters.newWorkspaceName != null) {
      newWorkspace.name = mockParameters.newWorkspaceName
    }

    server.use(rest.put(`http://localhost:5000/workspace/${mockParameters.workspaceToUpdate.id}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(newWorkspace), ctx.delay(50))
    }))
  }
}

export const mockServerForCreating = (server: SetupServerApi, workspace: Workspace | undefined, errorDescription?: string): void => {
  mockServerForManagingWorkspace(server, {
    newWorkspaceReturn: workspace,
    errorDescription
  })
}

export const mockServerForUpdating = (server: SetupServerApi, workspace: Workspace, newName: string | undefined, newDescription: string | undefined, forcedWorkspaceId?: string, workspaceList?: Workspace[]): void => {
  mockServerForManagingWorkspace(server, {
    workspaceToUpdate: workspace,
    workspaceList: workspaceList ?? [workspace],
    newWorkspaceName: newName,
    newWorkspaceDescription: newDescription
  }, forcedWorkspaceId)
}

export const mockServerForDelete = (server: SetupServerApi, workspace: Workspace, errorDescription?: string, workspaceList?: Workspace[], nullWorkspaceList: boolean = false, forcedWorkspaceId?: string): void => {
  const workspaceListToUse = nullWorkspaceList ? null : workspaceList ?? [workspace]
  mockServerForManagingWorkspace(server, {
    workspaceToUpdate: workspace,
    workspaceList: workspaceListToUse,
    errorDescription
  }, forcedWorkspaceId)
}

test('only to avoid error', () => {})
