import React, { FC, ReactElement } from 'react'
import { defaultColors } from '../../configs/colors'
import PlainButton from '../plain-button'
import { Screen, Container, TitleContainer, DetailContainer, ButtonContainer } from './style'

interface DialogProps {
  title?: string
  children: ReactElement
  show: boolean
  onOkClick?: Function | null
  onCancelClick?: Function | null
  dataTestId?: string
}

const Dialog: FC<DialogProps> = ({ title, children, show, onOkClick = null, onCancelClick = null, dataTestId = 'dialog-screen' }: DialogProps) => {
  const onOkClickFunction = (): void => {
    if (onOkClick !== null) {
      onOkClick()
    }
  }

  const onCancelClickFunction = (): void => {
    if (onCancelClick !== null) {
      onCancelClick()
    }
  }

  const renderCancelButton = (): ReactElement | null => {
    if (onCancelClick === null) {
      return null
    }

    return (
      <PlainButton dataTestId={'dialog-cancel-btn'} text={'Cancelar'} color={'white'} textColor={defaultColors.primary.main} onClick={onCancelClickFunction} />
    )
  }

  const renderButtons = (): ReactElement => {
    return (
      <ButtonContainer>
        <PlainButton dataTestId={'dialog-ok-btn'} text={'OK'} color={defaultColors.primary.main} textColor={'white'} onClick={onOkClickFunction} />
        {renderCancelButton()}
      </ButtonContainer>
    )
  }

  return (
    <Screen show={show} data-testid={dataTestId}>
      <Container>

        <TitleContainer>
          {title}
        </TitleContainer>

        <DetailContainer>
          {children}
        </DetailContainer>

        {renderButtons()}
      </Container>
    </Screen>
  )
}

export default Dialog
