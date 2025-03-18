import styled from 'styled-components'
import { defaultColors } from '../../configs/colors'

export const Container = styled.div`
  display: block;
  padding: 10px;
`

export const InputContainer = styled.div`
  border: 1px solid ${defaultColors.primary.main};
  padding: 5px;
  display: flex;
`

export const Input = styled.input`
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border: none;
  padding: 5px;
  color: ${defaultColors.primary.main};

  &:focus {
    outline: 0;
  }
`

export const TextArea = styled.textarea`
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  padding: 5px;
  border: none;

  &:focus {
    outline: 0;
  }
`

export const Title = styled.div`
  font-size: 12px
`

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${defaultColors.primary.light};
  padding-left: 5px;
  padding-right: 5px;
`
