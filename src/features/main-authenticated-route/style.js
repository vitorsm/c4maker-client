import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const TopRightMenuContainer = styled.div`
  position: absolute;
  top: 10px;
  left: calc(100% - 80px);
  z-index: 100;
`
export const TopLeftMenuContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 100;
`
export const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;
  font-size: 1.1em;
`
export const ContentCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  margin: 20px;
  padding: 20px;
  height: ${window.innerHeight - 180}px;
`
