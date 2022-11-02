import styled, { keyframes } from 'styled-components'

const appear = keyframes`
  from {
    margin-left: ${window.innerWidth}px;
  }
`

export const Container = styled.div`
  animation: ${appear} ${props => props.time}s ease-out;
`
