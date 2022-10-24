
import { combineReducers } from 'redux'
import { userReducer } from './users'
import { errorReducer } from './errors'
import { diagramReducer } from './diagrams'

const reducers = combineReducers({
  userReducer,
  errorReducer,
  diagramReducer
})

export type RootState = ReturnType<typeof reducers>

export default reducers
