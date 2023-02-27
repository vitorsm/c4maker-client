
import { combineReducers } from 'redux'
import { userReducer } from './users'
import { errorReducer } from './errors'
import { diagramReducer } from './diagrams'
import { workspaceReducer } from './workspaces'

const reducers = combineReducers({
  userReducer,
  errorReducer,
  diagramReducer,
  workspaceReducer
})

export type RootState = ReturnType<typeof reducers>

export default reducers
