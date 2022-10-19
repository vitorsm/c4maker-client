import styled from 'styled-components'

export const Screen = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  display: ${(props) => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  transition: 1s ease-in;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 200px 10px 200px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  background-color: white;
`

export const TitleContainer = styled.div`
  margin: 10px;
  text-align: center;
`

export const DetailContainer = styled.div`
  margin: 30px;
`

export const ButtonContainer = styled.div`
  margin: 10px;
  text-align: center;
`
