import styled, { keyframes } from 'styled-components'
import { defaultColors } from '../../configs/colors'

const menuTransition = keyframes`
  from {
    width: 0px;
    min-width: 0px;
    border-radius: 80%;
    opacity: 0;
  }
`

export const MenuContainer = styled.div`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-width: ${(props) => props.size}px;
  border-radius: 50%;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color};
  transition: background-color 1s;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.hoverColor};
    transition: background-color 1s;
  }
`

export const MenuComponent = styled.div`
  padding: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  min-width: 100px;
  border-radius: 10%;
  margin-left: ${props => props.marginLeft || 0}px;
  background-color: white;
  animation: ${menuTransition} 0.1s linear;
  opacity: 1;
`

export const MenuItem = styled.div`
  border-bottom-style: none;
  border-bottom-color: green;
  border-bottom-width: 1px;
  padding: 10px;
  cursor: default;

  &:hover {
    background-color: ${defaultColors.selected.main};
    transition: background-color 1s;
  }
`
