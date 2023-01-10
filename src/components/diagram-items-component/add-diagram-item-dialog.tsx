import React, { FC, ReactElement, useEffect, useState } from 'react'
import { DiagramItem, DiagramItemType } from '../../models/diagram'
import Dialog from '../dialog/dialog'
import TextInput from '../text-input'
import { DiagramItemFormContainer } from './style'

interface AddDiagramItemDialogProps {
  diagramItem: DiagramItem | null
  show: boolean
  onOkClick: Function
  onCancelClick: Function
  dataTestId?: string
}

const AddDiagramItemDialog: FC<AddDiagramItemDialogProps> = ({ diagramItem, show, onOkClick, onCancelClick, dataTestId }: AddDiagramItemDialogProps) => {
  const [updatedDiagramItem, setUpdatedDiagramItem] = useState<DiagramItem | null>(null)

  useEffect(() => {
    setUpdatedDiagramItem(insantiateDiagramItem(diagramItem))
  }, [diagramItem, show])

  const insantiateDiagramItem = (diagramItem: DiagramItem | null): DiagramItem => {
    if (diagramItem !== null) {
      return { ...diagramItem }
    }

    return {
      name: '',
      itemDescription: '',
      details: '',
      itemType: DiagramItemType.PERSON,
      diagram: null,
      parent: null,
      relationships: [],
      canvasData: {
        position: null,
        color: null
      },
      isSelected: true
    }
  }

  const onCancelClickInternal = (): void => {
    onCancelClick()
    setUpdatedDiagramItem(null)
  }

  const onOkClickInternal = (): void => {
    onOkClick(updatedDiagramItem)
    setUpdatedDiagramItem(null)
  }

  const renderFormBody = (): ReactElement | null => {
    if (updatedDiagramItem === null) return null

    return (
      <DiagramItemFormContainer>
        <TextInput title={'Name'} value={updatedDiagramItem.name}></TextInput>
        <TextInput title={'Description'} value={updatedDiagramItem.itemDescription}></TextInput>
        <TextInput title={'Details'} value={updatedDiagramItem.details} type="text-area"></TextInput>
      </DiagramItemFormContainer>
    )
  }

  return (
    <Dialog title="Diagram item" show={show} onOkClick={onOkClickInternal} onCancelClick={onCancelClickInternal} dataTestId={dataTestId}>
      <>
        {renderFormBody()}
      </>
    </Dialog>
  )
}

export default AddDiagramItemDialog
