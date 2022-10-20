import React, { FC, ReactElement, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Dialog from '../../components/dialog'
import GenericError from '../../models/generic_error'
import { Container, MessageContainer } from './style'

const ErrorDialog: FC = () => {
  const [showDialog, setShowDialog] = useState(false)
  const genericError: GenericError | null = useSelector((state: any) => state.errorReducer.error)

  useEffect(() => {
    if (genericError != null) {
      setShowDialog(true)
    }
  }, [genericError])

  const onOkClickFunction = (): void => {
    setShowDialog(false)
  }

  const dialogContent = (): ReactElement => {
    return (
      <Container>
        <MessageContainer>
          {genericError?.description}
        </MessageContainer>
      </Container>
    )
  }

  return (
    <Dialog title={genericError?.name} show={showDialog} onOkClick={onOkClickFunction} >
      {dialogContent()}
    </Dialog>
  )
}

export default ErrorDialog
