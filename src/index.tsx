import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'

interface ItemState {
  value: number
}

const counterReducer = (state: ItemState = { value: 0 }, action: any): ItemState => {
  switch (action.type) {
    case 'test':
      return { value: state.value + 1 }
    default:
      return state
  }
}

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

const container = document.getElementsByClassName('root')
const root = createRoot(container[0])

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log)
