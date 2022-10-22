
import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import { compose } from 'redux'
import thunk from 'redux-thunk'

import reducers, { RootState } from './reducers'

const setupStore = (preloadedState?: PreloadedState<RootState>): any => {
  return configureStore({
    reducer: reducers,
    middleware: [thunk],
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: compose,
    preloadedState
  })
}

export type AppState = ReturnType<typeof setupStore>

export default setupStore
