import styled from 'styled-components'

export const Container = styled.div`
  display: inline-block;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  text-align: center;
`

export const CardContainer = styled.div`
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 25%;

  &:hover {
    background-color: ${props => props.hoverColor};
    transition: background-color 1s;
  }
`

export const DescriptionContainer = styled.div`
  padding: 0px;
  font-size: 0.8em;
`
