import styled from 'styled-components'
import { defaultColors } from '../../configs/colors'

export const Container = styled.div`
    display: flex;
    justify-content: center;
    padding: 200px;
`

export const Content = styled.div`
    display: block;
    padding: 50px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: white;
`

export const NewAccountContainer = styled.div`
    margin-top: 50px;
    text-align: center;
`

export const IconContainer = styled.div`
    text-align: center;
    margin: 20px;
    color: ${defaultColors.primary.main};
`

export const ButtonContainer = styled.div`
    margin-top: 20px;
    text-align: center;
`

export const ScreenContainer = styled.div`
    background-image: url(./background1.jpg);
`
