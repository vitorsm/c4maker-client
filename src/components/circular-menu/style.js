import styled from 'styled-components'

export const MenuContainer = styled.div`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-width: ${(props) => props.size}px;
  border-radius: 50%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`
