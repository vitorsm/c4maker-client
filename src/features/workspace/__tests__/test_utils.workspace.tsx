import { waitFor, screen, fireEvent } from '@testing-library/react'
import { DEFAULT_BREADCRUMBS_TEST_ID } from '../../../components/breadcrumbs/breadcrumbs'
import Workspace from '../../../models/workspace'
import { SetupServerApi } from 'msw/lib/node'
import { rest } from 'msw'
import { mockLoadCurrentUser } from '../../../__tests__/test_utils'

export interface WorkspaceMockServerParameters {
  newWorkspaceReturn?: Workspace
  workspaceToUpdate?: Workspace
  workspaceList?: Workspace[]
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

export const openWorkspaceComponent = async (store: any, oldDescription: string, indexOfWorkspaceToOpen: number = 0): Promise<void> => {
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
    expect(screen.queryByTestId('create-workspace-component-description')).toHaveTextContent(oldDescription)
  })
}

export const mockServerForManagingWorkspace = (server: SetupServerApi, mockParameters: WorkspaceMockServerParameters): void => {
  let workspaceToReturn = null
  if (mockParameters.workspaceToUpdate?.id != null) {
    workspaceToReturn = mockParameters.workspaceToUpdate
  } else if (mockParameters.newWorkspaceReturn?.id != null) {
    workspaceToReturn = mockParameters.newWorkspaceReturn
  }

  if (mockParameters.workspaceList !== undefined) {
    server.use(rest.get('http://localhost:5000/workspace', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockParameters.workspaceList), ctx.delay(50))
    }))
  }

  if (mockParameters.errorDescription != null) {
    server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
      return res(ctx.status(400), ctx.json({ description: mockParameters.errorDescription }), ctx.delay(150))
    }))
  }

  if (workspaceToReturn?.id != null) {
    server.use(rest.post('http://localhost:5000/workspace', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(workspaceToReturn), ctx.delay(50))
    }))
    server.use(rest.get(`http://localhost:5000/workspace/${workspaceToReturn.id}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(workspaceToReturn), ctx.delay(50))
    }))
    server.use(rest.get(`http://localhost:5000/workspace/${workspaceToReturn.id}/diagrams`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]), ctx.delay(150))
    }))
    server.use(rest.get(`http://localhost:5000/workspace/${workspaceToReturn.id}/workspace-items`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]), ctx.delay(150))
    }))

    if (mockParameters.errorDescription != null) {
      server.use(rest.delete(`http://localhost:5000/workspace/${workspaceToReturn.id}`, (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ description: mockParameters.errorDescription }), ctx.delay(50))
      }))
    } else {
      server.use(rest.delete(`http://localhost:5000/workspace/${workspaceToReturn.id}`, (req, res, ctx) => {
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

export const mockServerForUpdating = (server: SetupServerApi, workspace: Workspace, newName: string | undefined, newDescription: string | undefined): void => {
  mockServerForManagingWorkspace(server, {
    workspaceToUpdate: workspace,
    workspaceList: [workspace],
    newWorkspaceName: newName,
    newWorkspaceDescription: newDescription
  })
}

export const mockServerForDelete = (server: SetupServerApi, workspace: Workspace, errorDescription?: string, workspaceList?: Workspace[]): void => {
  mockServerForManagingWorkspace(server, {
    workspaceToUpdate: workspace,
    workspaceList: workspaceList ?? [workspace],
    errorDescription
  })
}

test('only to avoid error', () => {})
