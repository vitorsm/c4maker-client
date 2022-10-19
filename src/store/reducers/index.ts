
import { combineReducers } from 'redux'
import { userReducer } from './users'
import { errorReducer } from './errors'

const reducers = combineReducers({
  userReducer,
  errorReducer
})

export default reducers
