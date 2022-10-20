import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginScreen from './features/login/'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getToken } from './store/token_utils'
import { getCurrentUser } from './store/reducers/users/operations'
import User from './models/user'
import ErrorDialog from './features/error-dialog'

const App: FC<{}> = () => {
  const dispatch = useDispatch()
  let currentUser: User | null | undefined
  useSelector((state: any) => { currentUser = state.userReducer.currentUser?.data })
  const token = getToken()

  const isUnauthenticatedPath = (): boolean => {
    return window.location.pathname.includes('/login') || window.location.pathname.includes('/new-user')
  }

  const goToLoginIfNotAuthenticate = async (): Promise<void> => {
    if ((token == null || currentUser === undefined) && !isUnauthenticatedPath()) {
      window.location.pathname = 'login'
    }

    if (token !== null) {
      await getCurrentUser(dispatch)
    }
  }

  goToLoginIfNotAuthenticate().then(() => {}, () => {})

  return (
    <div className="App">
      <>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<LoginScreen />} />
          </Routes>
        </BrowserRouter>

        <ErrorDialog />
      </>
    </div>
  )
}

export default App
