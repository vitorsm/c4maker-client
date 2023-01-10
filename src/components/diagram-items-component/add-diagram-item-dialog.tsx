import React, { FC, ReactElement, useEffect, useState } from 'react'
import { DiagramItem, DiagramItemType } from '../../models/diagram'
import Dialog from '../dialog/dialog'
import TextInput from '../text-input'
import { DiagramItemFormContainer } from './style'

interface AddDiagramItemDialogProps {
  diagramItem: DiagramItem | null
  show: boolean
  onOkClick: (diagramItem: DiagramItem) => void
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
    if (updatedDiagramItem !== null) {
      onOkClick(updatedDiagramItem)
    }

    setUpdatedDiagramItem(null)
  }

  const onNameChange = (newName: string): void => {
    if (updatedDiagramItem === null) return
    updatedDiagramItem.name = newName
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onDescriptionChange = (newDescription: string): void => {
    if (updatedDiagramItem === null) return
    updatedDiagramItem.itemDescription = newDescription
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onDetailsChange = (newDetails: string): void => {
    if (updatedDiagramItem === null) return
    updatedDiagramItem.details = newDetails
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const renderFormBody = (): ReactElement | null => {
    if (updatedDiagramItem === null) return null

    return (
      <DiagramItemFormContainer>
        <TextInput title={'Name'} value={updatedDiagramItem.name} onChange={onNameChange}></TextInput>
        <TextInput title={'Description'} value={updatedDiagramItem.itemDescription} onChange={onDescriptionChange}></TextInput>
        <TextInput title={'Details'} value={updatedDiagramItem.details} type="text-area" onChange={onDetailsChange}></TextInput>
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
