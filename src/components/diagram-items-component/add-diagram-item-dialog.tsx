import React, { FC, ReactElement, useEffect, useState } from 'react'
import { DiagramItem } from '../../models/diagram'
import { WorkspaceItemType } from '../../models/workspace'
import Dialog from '../dialog/dialog'
import TextInput from '../text-input'
import { DiagramItemFormContainer } from './style'
import SelectComponent from '../select-component'
import { SelectItem } from '../select-component/select-component'

const DEFAULT_SELECTED_ITEM_TYPE = WorkspaceItemType.PERSONA

const DEFAULT_DIAGRAM_ITEM = {
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
interface AddDiagramItemDialogProps {
  diagramItem: DiagramItem | null
  show: boolean
  onOkClick: (diagramItem: DiagramItem) => void
  onCancelClick: Function
  dataTestId?: string
}

const AddDiagramItemDialog: FC<AddDiagramItemDialogProps> = ({ diagramItem, show, onOkClick, onCancelClick, dataTestId = 'add-new-diagram-item' }: AddDiagramItemDialogProps) => {
  const [updatedDiagramItem, setUpdatedDiagramItem] = useState<DiagramItem>(DEFAULT_DIAGRAM_ITEM)

  useEffect(() => {
    setUpdatedDiagramItem(insantiateDiagramItem(diagramItem))
  }, [diagramItem, show])

  const insantiateDiagramItem = (diagramItem: DiagramItem | null): DiagramItem => {
    if (diagramItem !== null) {
      return { ...diagramItem }
    }

    return DEFAULT_DIAGRAM_ITEM
  }

  const onCancelClickInternal = (): void => {
    onCancelClick()
    setUpdatedDiagramItem(DEFAULT_DIAGRAM_ITEM)
  }

  const onOkClickInternal = (): void => {
    onOkClick(updatedDiagramItem)

    setUpdatedDiagramItem(DEFAULT_DIAGRAM_ITEM)
  }

  const onNameChange = (newName: string): void => {
    updatedDiagramItem.workspaceItem.name = newName
    updatedDiagramItem.workspaceItem.key = newName
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onDescriptionChange = (newDescription: string): void => {
    updatedDiagramItem.workspaceItem.description = newDescription
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onDetailsChange = (newDetails: string): void => {
    updatedDiagramItem.workspaceItem.details = newDetails
    setUpdatedDiagramItem(updatedDiagramItem)
  }

  const onWorkspaceItemChange = (newItemType: string): void => {
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
    return (
      <DiagramItemFormContainer>
        <TextInput title={'Name'} value={updatedDiagramItem.workspaceItem.name} onChange={onNameChange} dataTestId='new-diagram-item-name-input'></TextInput>
        <TextInput title={'Description'} value={updatedDiagramItem.workspaceItem.description ?? ''} onChange={onDescriptionChange} dataTestId='new-diagram-item-description-input'></TextInput>
        <TextInput title={'Details'} value={updatedDiagramItem.workspaceItem.details ?? ''} type="text-area" onChange={onDetailsChange} dataTestId='new-diagram-item-details-input'></TextInput>
        <SelectComponent title='Item Type' items={getTypeItems()} onChangeSelection={onWorkspaceItemChange} selectedKey={updatedDiagramItem.workspaceItem.workspaceItemType} dataTestId='new-diagram-item-type-input'/>
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
