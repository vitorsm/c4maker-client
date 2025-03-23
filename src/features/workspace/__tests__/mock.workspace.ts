import Workspace from '../../../models/workspace'

export const mockWorkspace = (id: string = 'workspace_id', name: string = 'Workspace', description: string | null = null): Workspace => {
  return {
    id, name, description
  }
}

test.skip('mock only', () => {
  // This test will be ignored
})
