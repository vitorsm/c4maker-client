import React, { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { render, RenderOptions } from '@testing-library/react'
import type { PreloadedState } from '@reduxjs/toolkit'
import { RootState } from '../store/reducers'
import setupStore, { AppState } from '../store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>
  store?: AppState
}

export function renderWithProvideres (
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
): any {
  function Wrapper ({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
