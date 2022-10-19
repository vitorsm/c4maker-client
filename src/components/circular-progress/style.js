import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`

export const Container = styled.div`
    display: flex;
    justify-content: center;
`

export const Circular = styled.div`
    border-top: solid 5px;
    border-top-width: ${(props) => props.borderSize}px;
    border-top-color: ${(props) => props.color};
    border-color: ${(props) => props.borderColor};
    border-radius: ${(props) => props.size / 2}px;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    animation: ${rotate} 1s linear infinite;
`
