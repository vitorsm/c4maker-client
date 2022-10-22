
import { combineReducers } from 'redux'
import { userReducer } from './users'
import { errorReducer } from './errors'

const reducers = combineReducers({
  userReducer,
  errorReducer
})

export type RootState = ReturnType<typeof reducers>

export default reducers
