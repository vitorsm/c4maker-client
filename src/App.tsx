import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginScreen from './features/login/'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { getToken } from './store/token_utils'
import { getCurrentUser } from './store/reducers/users/operations'
import User from './models/user'

const App: FC<{}> = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let currentUser: User | null | undefined
  const token = getToken()

  useEffect(() => {
    goToLoginIfNotAuthenticate().then(() => {}, () => {})
  })

  useSelector((state: any) => { currentUser = state.userReducer.currentUser?.data })

  const isUnauthenticatedPath = (): boolean => {
    return window.location.pathname.includes('/login') || window.location.pathname.includes('/new-user')
  }

  const goToLoginIfNotAuthenticate = async (): Promise<void> => {
    if ((token == null || currentUser === undefined) && !isUnauthenticatedPath()) {
      navigate('/login')
    }

    if (token !== null) {
      await getCurrentUser(dispatch)
    }
  }

  return (
    <Routes>
      <Route path="" element={<div>home</div>} />
      <Route path="login" element={<LoginScreen />} />
    </Routes>
  )
}

export default App
