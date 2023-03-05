import styled from 'styled-components'

export const Container = styled.div`
  cursor: pointer;
  padding: 3px;
  box-shadow: ${(props) => props.border ? '0 4px 8px 0 rgba(0,0,0,0.2)' : 'none'};
`
