import styled from 'styled-components'

export const Container = styled.button`
  text-align: center;
  padding: 10px 20px 10px 20px;
  margin: 10px;
  cursor: ${(props) => props.disabled ? 'auto' : 'pointer'};
  color: ${(props) => props.textColor || 'black'};
  background-color: ${(props) => props.color || 'white'};
  opacity: ${(props) => props.disabled ? 0.8 : 1};
  width: ${(props) => props.fillWidth ? 'calc(100% - 20px)' : ''};
`
