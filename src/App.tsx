import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import LoginScreen from './features/login/'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { getToken } from './store/token_utils'
import { getCurrentUser } from './store/reducers/users/operations'
import MainAuthenticatedRoute from './features/main-authenticated-route'

const App: FC<{}> = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = getToken()

  useEffect(() => {
    goToLoginIfNotAuthenticate().then(() => {}, () => {})
  })

  const isUnauthenticatedPath = (): boolean => {
    return window.location.pathname.includes('/login') || window.location.pathname.includes('/new-user')
  }

  const goToLoginIfNotAuthenticate = async (): Promise<void> => {
    if ((token == null) && !isUnauthenticatedPath()) {
      navigate('/login')
    }

    if (token !== null) {
      await getCurrentUser(dispatch)
    }
  }

  return (
    <Routes>
      <Route path="/*" element={<MainAuthenticatedRoute />} />
      <Route path="login" element={<LoginScreen />} />
    </Routes>
  )
}

export default App
