import React, { FC, ReactElement, useEffect, useState } from 'react'
import { DiagramItem } from '../../models/diagram'
import { WorkspaceItemType } from '../../models/workspace'
import Dialog from '../dialog/dialog'
import TextInput from '../text-input'
import { DiagramItemFormContainer } from './style'
import SelectComponent from '../select-component'
import { SelectItem } from '../select-component/select-component'

const DEFAULT_SELECTED_ITEM_TYPE = WorkspaceItemType.PERSONA

const getDefaultDiagramItem = (): DiagramItem => {
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

interface AddDiagramItemDialogProps {
  diagramItem: DiagramItem | null
  show: boolean
  onOkClick: (diagramItem: DiagramItem) => void
  onCancelClick: Function
  dataTestId?: string
}

const AddDiagramItemDialog: FC<AddDiagramItemDialogProps> = ({ diagramItem, show, onOkClick, onCancelClick, dataTestId = 'add-new-diagram-item' }: AddDiagramItemDialogProps) => {
  const [itemName, setItemName] = useState<string>('')
  const [itemDescription, setItemDescription] = useState<string>('')
  const [itemDetails, setItemDetails] = useState<string>('')
  const [itemType, setItemType] = useState<WorkspaceItemType>(WorkspaceItemType.PERSONA)

  useEffect(() => {
    defineInputValues(diagramItem)
  }, [diagramItem, show])

  const defineInputValues = (diagramItem: DiagramItem | null): void => {
    setItemName(diagramItem?.workspaceItem != null ? diagramItem.workspaceItem.name : '')
    setItemDescription(diagramItem?.workspaceItem?.description != null ? diagramItem.workspaceItem.description : '')
    setItemDetails(diagramItem?.workspaceItem?.details != null ? diagramItem.workspaceItem.details : '')
    setItemType(diagramItem?.workspaceItem != null ? diagramItem.workspaceItem.workspaceItemType : DEFAULT_SELECTED_ITEM_TYPE)
  }

  const getDigramItemWithNewValues = (): DiagramItem => {
    const newDiagramItem = diagramItem != null ? diagramItem : getDefaultDiagramItem()
    newDiagramItem.workspaceItem.name = itemName
    newDiagramItem.workspaceItem.key = itemName
    newDiagramItem.workspaceItem.description = itemDescription !== '' ? itemDescription : null
    newDiagramItem.workspaceItem.details = itemDetails !== '' ? itemDetails : null
    newDiagramItem.workspaceItem.workspaceItemType = itemType

    return newDiagramItem
  }

  const onCancelClickInternal = (): void => {
    onCancelClick()
    defineInputValues(null)
  }

  const onOkClickInternal = (): void => {
    onOkClick(getDigramItemWithNewValues())
    defineInputValues(null)
  }

  const onNameChange = (newName: string): void => {
    setItemName(newName)
  }

  const onDescriptionChange = (newDescription: string): void => {
    setItemDescription(newDescription)
  }

  const onDetailsChange = (newDetails: string): void => {
    setItemDetails(newDetails)
  }

  const onWorkspaceItemChange = (newItemType: string): void => {
    setItemType(WorkspaceItemType[newItemType as keyof typeof WorkspaceItemType])
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
        <TextInput title={'Name'} value={itemName} onChange={onNameChange} dataTestId='new-diagram-item-name-input'></TextInput>
        <TextInput title={'Description'} value={itemDescription} onChange={onDescriptionChange} dataTestId='new-diagram-item-description-input'></TextInput>
        <TextInput title={'Details'} value={itemDetails} type="text-area" onChange={onDetailsChange} dataTestId='new-diagram-item-details-input'></TextInput>
        <SelectComponent title='Item Type' items={getTypeItems()} onChangeSelection={onWorkspaceItemChange} selectedKey={itemType} dataTestId='new-diagram-item-type-input'/>
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
