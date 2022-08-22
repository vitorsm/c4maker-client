
import { configureStore } from '@reduxjs/toolkit'
import { compose } from 'redux'
import thunk from 'redux-thunk'

import reducers from './reducers'

const store = configureStore({
  reducer: reducers,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: compose
})

export default store
