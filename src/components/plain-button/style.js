import styled from 'styled-components'

export const Container = styled.button`
  text-align: center;
  padding: 10px 20px 10px 20px;
  margin: 10px;
  cursor: ${(props) => props.disabled ? 'auto' : 'pointer'};
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.color};
  opacity: ${(props) => props.disabled ? 0.8 : 1};
  width: ${(props) => props.fillWidth ? 'calc(100% - 20px)' : ''};
  border: 0;
  background-color: ${(props) => props.color};
  box-shadow: 0px 0px 3px 2px ${(props) => props.color};
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
`
