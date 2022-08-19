import styled from 'styled-components'

export const Container = styled.div`
  display: block;
  padding: 10px;
`

export const Input = styled.input`
    padding: 10px;
    width: ${(props) => props.fillWidth ? 'calc(100% - 20px)' : ''};
`

export const Title = styled.div`
    font-size: 12px
`
