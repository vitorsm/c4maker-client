import React, { FC, ReactElement, useEffect, useState } from 'react'
import { DiagramItem } from '../../models/diagram'
import { WorkspaceItemType } from '../../models/workspace'
import Dialog from '../dialog/dialog'
import TextInput from '../text-input'
import { DiagramItemFormContainer } from './style'
import SelectComponent from '../select-component'
import { SelectItem } from '../select-component/select-component'

interface AddDiagramItemDialogProps {
  diagramItem: DiagramItem | null
  show: boolean
  onOkClick: (diagramItem: DiagramItem) => void
  onCancelClick: Function
  dataTestId?: string
}

const DEFAULT_SELECTED_ITEM_TYPE = WorkspaceItemType.PERSONA

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
      workspaceItem: {
        name: '',
        key: '',
        description: '',
        details: '',
        workspaceItemType: DEFAULT_SELECTED_ITEM_TYPE,
        workspace: null
      },
      diagram: null,
      parent: null,
      relationships: [],
      data: {
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
    updatedDiagramItem.workspaceItem.name = newName
    updatedDiagramItem.workspaceItem.key = newName
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onDescriptionChange = (newDescription: string): void => {
    if (updatedDiagramItem === null) return
    updatedDiagramItem.workspaceItem.description = newDescription
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onDetailsChange = (newDetails: string): void => {
    if (updatedDiagramItem === null) return
    updatedDiagramItem.workspaceItem.details = newDetails
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onWorkspaceItemChange = (newItemType: string): void => {
    if (updatedDiagramItem === null) return
    updatedDiagramItem.workspaceItem.workspaceItemType = WorkspaceItemType[newItemType as keyof typeof WorkspaceItemType]
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const getTypeItems = (): SelectItem[] => {
    return [
      {
        key: WorkspaceItemType.PERSONA,
        content: 'Persona'
      }, {
        key: WorkspaceItemType.CONTAINER,
        content: 'Container'
      }, {
        key: WorkspaceItemType.MOBILE_CONTAINER,
        content: 'Container - Mobile'
      }, {
        key: WorkspaceItemType.WEB_CONTAINER,
        content: 'Container - Web'
      }, {
        key: WorkspaceItemType.COMPONENT,
        content: 'Component'
      }, {
        key: WorkspaceItemType.DATABASE,
        content: 'Database'
      }, {
        key: WorkspaceItemType.ENTITY,
        content: 'Entity'
      }
    ]
  }

  const renderFormBody = (): ReactElement | null => {
    if (updatedDiagramItem === null) return null

    return (
      <DiagramItemFormContainer>
        <TextInput title={'Name'} value={updatedDiagramItem.workspaceItem.name} onChange={onNameChange}></TextInput>
        <TextInput title={'Description'} value={updatedDiagramItem.workspaceItem.description ?? ''} onChange={onDescriptionChange}></TextInput>
        <TextInput title={'Details'} value={updatedDiagramItem.workspaceItem.details ?? ''} type="text-area" onChange={onDetailsChange}></TextInput>
        <SelectComponent title='Item Type' items={getTypeItems()} onChangeSelection={onWorkspaceItemChange} selectedKey={updatedDiagramItem.workspaceItem.workspaceItemType}/>
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
