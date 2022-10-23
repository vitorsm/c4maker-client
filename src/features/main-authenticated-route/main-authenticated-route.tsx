import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import CircularMenu from '../../components/circular-menu'
import { TopRightMenuContainer } from './style'

const MainAuthenticatedRoute: FC = () => {
  return (
    <div data-testid='main-authenticated-route-component'>
      Main route
      <TopRightMenuContainer>
        <CircularMenu icon={<div>icon</div>} size={80} />
      </TopRightMenuContainer>

      <Routes>
        <Route path='diagrams' element={<div>diagrams</div>} />
      </Routes>
    </div>
  )
}

export default MainAuthenticatedRoute
