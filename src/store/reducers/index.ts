
import { combineReducers } from 'redux'
import { userReducer } from './users'
import { errorReducer } from './errors'
import { diagramReducer } from './diagrams'
import { workspaceReducer } from './workspaces'
import { breadcrumbsReducer } from './breadcrumbs'

const reducers = combineReducers({
  userReducer,
  errorReducer,
  diagramReducer,
  workspaceReducer,
  breadcrumbsReducer
})

export type RootState = ReturnType<typeof reducers>

export default reducers
