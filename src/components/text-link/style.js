import style from 'styled-components'

export const Container = style.div`
    cursor: pointer;
    text-decoration: underline;
    color: ${(props) => props.color};
`
