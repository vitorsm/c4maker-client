import styled from 'styled-components'
import { defaultColors } from '../../configs/colors'

export const Container = styled.div`
  display: flex;
`

export const Input = styled.input`
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border: none;
  padding: 5px;
  color: ${props => props.isPlaceholder ? defaultColors.primary.light : defaultColors.primary.main};

  &:hover {
  }

  &:focus {
    outline: 0;
  }

  &:focus-visible {
  }

  &:focus-within {
  }

  &:active {
  }

  &:target {
  }

  &:visited {
  }
`

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${defaultColors.primary.light};
`
