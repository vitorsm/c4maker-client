import styled from 'styled-components'

export const TooltipText = styled.div`
  padding: 5px;
  background-color: ${props => props.color};
  color: ${props => props.textColor};
  border-radius: 10%;
  position: absolute;
  left: ${props => props.positionX};
  top: ${props => props.positionY};
  font-size: 0.7em;
`
