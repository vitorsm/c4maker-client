import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { BreadcrumbsItem } from '../../components/breadcrumbs/breadcrumbs'
import CircularProgress from '../../components/circular-progress'
import Diagram, { DiagramItem } from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import { RootState } from '../../store/reducers'
import { diagramOperations } from '../../store/reducers/diagrams'
import { DiagramContainer } from './style'
import DiagramItemsComponent from '../../components/diagram-items-component'
import AnimatedContainer from '../../components/animated-container'
import useBreadcrumbs from '../../store/reducers/breadcrumbs/use-breadcrumbs'
import { updateItemInList } from '../../utils/list-utils'
import { getDiagramItemsByKeys, setIsOpenedInList } from '../../models/diagram-utils'

interface DiagramItemUpdate {
  diagramItem: DiagramItem
  operation: 'ADD' | 'UPDATE' | 'DELETE'
}

const DiagramComponent: FC = () => {
  const { diagramId } = useParams()

  const dispatch = useDispatch()

  const onBreadcrumbsItemChanged = (breadcrumbsItem: BreadcrumbsItem): void => {
    const diagram = getDiagramOrNull()
    if (diagram?.id !== breadcrumbsItem.key) {
      return
    }

    updateDiagramName(breadcrumbsItem.name)
  }
  const { addBreadcrumbItem } = useBreadcrumbs(onBreadcrumbsItemChanged)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [diagramItems, setDiagramItems] = useState<DiagramItem[]>([])
  const [selectedDiagramItems, setSelectedDiagramItems] = useState<DiagramItem[]>([])
  const [itemsToSync, setItemsToSync] = useState <Map<string, DiagramItemUpdate>>(new Map())
  const diagram: ObjectWrapper<Diagram> = useSelector((rootState: RootState) => rootState.diagramReducer.diagram)
  const loadedDiagramItem: ObjectWrapper<DiagramItem> = useSelector((rootState: RootState) => rootState.diagramReducer.diagramItem)
  const loadedDiagramItems: ObjectWrapper<DiagramItem[]> = useSelector((rootState: RootState) => rootState.diagramReducer.diagramItems)
  const deletedDiagramItem: ObjectWrapper<string> = useSelector((rootState: RootState) => rootState.diagramReducer.deletedDiagramItem)

  useEffect(() => {
    fetchDiagram()
  }, [diagramId])

  useEffect(() => {
    setIsLoading(false)
    generateBreadcrumbsItem()
  }, [diagram])

  useEffect(() => {
    if (loadedDiagramItems.data == null) {
      return
    }

    setDiagramItems(loadedDiagramItems.data)
  }, [loadedDiagramItems])

  useEffect(() => {
    if (loadedDiagramItem.data == null) {
      return
    }

    updateDiagramItemOnList(loadedDiagramItem.data)
  }, [loadedDiagramItem])

  useEffect(() => {
    if (deletedDiagramItem.data == null) {
      return
    }

    setDiagramItems(diagramItems.filter(item => item.id !== deletedDiagramItem.data))
  }, [deletedDiagramItem])

  const generateBreadcrumbsItem = (): void => {
    if (diagram.data === null || diagram.data.id === undefined) {
      return
    }

    addBreadcrumbItem({
      key: diagram.data.id,
      name: diagram.data.name,
      details: diagram.data.description,
      onClick: () => {},
      editable: true
    }, 3)
  }

  const fetchDiagram = (): void => {
    if (diagramId === null || diagramId === undefined) {
      return
    }

    void diagramOperations.fetchDiagram(diagramId, dispatch)
    void diagramOperations.fetchItemsByDiagram(diagramId, dispatch)
    setIsLoading(true)
  }

  const updateDiagramItemOnList = (diagramItem: DiagramItem): void => {
    const selectedDiagramItemsKeys = selectedDiagramItems.map(item => item.workspaceItem.key)
    if (selectedDiagramItemsKeys.includes(diagramItem.workspaceItem.key)) {
      diagramItem.isSelected = true
    }

    const newDiagramItems: any = updateItemInList(diagramItem, diagramItems, (diagramItem: DiagramItem) => diagramItem.workspaceItem.key)
    setDiagramItems(newDiagramItems)
  }

  const onDiagramItemAdded = (diagramItem: DiagramItem): void => {
    const selectedDiagram = diagram.data

    if (selectedDiagram == null) {
      return
    }

    diagramItem.diagram = selectedDiagram
    diagramItem.workspaceItem.workspace = selectedDiagram.workspace
    diagramItem.diagramItemType = selectedDiagram.diagramType
    // void diagramOperations.createDiagramItem(diagramItem, dispatch)

    // updateDiagramItemOnList(diagramItem)
    setDiagramItems([...diagramItems, diagramItem])

    const newItemsToSync = new Map(itemsToSync)
    newItemsToSync.set(diagramItem.workspaceItem.key, { diagramItem, operation: 'ADD' })
    setItemsToSync(newItemsToSync)
  }

  const onDiagramItemChange = (newDiagramItems: DiagramItem[]): void => {
    const diagramItemKeys = newDiagramItems.map(diagramItem => diagramItem.workspaceItem.key)
    const filteredDiagramItems = getDiagramItemsByKeys(diagramItems, diagramItemKeys)

    const persistedDiagramMap = new Map()
    filteredDiagramItems.forEach(diagramItem => {
      persistedDiagramMap.set(diagramItem.workspaceItem.key, diagramItem)
    })

    newDiagramItems.forEach(newDiagramItem => {
      const diagramItem = persistedDiagramMap.get(newDiagramItem.workspaceItem.key)

      diagramItem.data = newDiagramItem.data
      diagramItem.isSelected = newDiagramItem.isSelected
      diagramItem.workspaceItem = newDiagramItem.workspaceItem
    })

    setDiagramItems([...diagramItems])

    const newItemsToSync = new Map(itemsToSync)
    newDiagramItems.forEach(diagramItem => {
      const operation = diagramItem.id == null ? 'ADD' : 'UPDATE'
      newItemsToSync.set(diagramItem.workspaceItem.key, { diagramItem, operation })
    })
    setItemsToSync(newItemsToSync)
  }

  const onDiagramItemDeleted = (diagramItemsToDelete: DiagramItem[]): void => {
    const newItemsToSync = new Map(itemsToSync)

    diagramItemsToDelete.forEach(item => {
      const isAlreadyCraeted = item.id != null
      if (isAlreadyCraeted) {
        newItemsToSync.set(item.workspaceItem.key, { diagramItem: item, operation: 'DELETE' })
      } else {
        newItemsToSync.delete(item.workspaceItem.key)
      }
    })
    setItemsToSync(newItemsToSync)
    const itemKeys = diagramItemsToDelete.map(diagramItem => diagramItem.workspaceItem.key)

    setDiagramItems(diagramItems.filter(diagramItem => !itemKeys.includes(diagramItem.workspaceItem.key)))
  }

  const onDiagramItemSelected = (newSelectedDiagramItems: DiagramItem[]): void => {
    setSelectedDiagramItems(newSelectedDiagramItems)
    const selectedKeys = newSelectedDiagramItems.map(item => item.workspaceItem.key)
    const newDiagramItem = diagramItems.map(item => ({ ...item, isSelected: selectedKeys.includes(item.workspaceItem.key) }))
    setDiagramItems(newDiagramItem)
  }

  const onDiagramItemOpened = (diagramItemOpened: DiagramItem): void => {
    const newDiagramItems = setIsOpenedInList(diagramItems, diagramItemOpened)
    setDiagramItems(newDiagramItems)
  }

  const syncItems = (): void => {
    itemsToSync.forEach((diagramItemOperation, diagramItemKey) => {
      switch (diagramItemOperation.operation) {
        case 'ADD':
          void diagramOperations.createDiagramItem(diagramItemOperation.diagramItem, dispatch)
          break
        case 'UPDATE':
          void diagramOperations.updateDiagramItem(diagramItemOperation.diagramItem, dispatch)
          break
        case 'DELETE':
          void diagramOperations.deleteDiagramItem(diagramItemOperation.diagramItem, dispatch)
          break
      }
      // void diagramOperations.createDiagramItem(diagramItem, dispatch)

      // void diagramOperations.updateDiagramItem(diagramItem, dispatch)
      // void diagramOperations.deleteDiagramItem(item, dispatch)
    })
    setItemsToSync(new Map())
  }

  const updateDiagramName = (diagramName: string): void => {
    const diagram = getDiagramOrNull()
    if (diagram === null) return

    diagram.name = diagramName
    void diagramOperations.updateDiagram(diagram, dispatch)
  }

  const getDiagramOrNull = (): Diagram | null => {
    if (diagramId !== diagram?.data?.id) {
      return null
    }

    return diagram.data
  }

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress />
      )
    }
    return (
      <DiagramContainer>

        <DiagramItemsComponent
          diagramItems={diagramItems}
          onSave={syncItems}
          onDiagramItemChange={onDiagramItemChange}
          onDiagramItemAdded={onDiagramItemAdded}
          onDiagramItemDeleted={onDiagramItemDeleted}
          onDiagramItemSelected={onDiagramItemSelected}
          onDiagramItemOpened={onDiagramItemOpened} />

      </DiagramContainer>

    )
  }
  return (
    <AnimatedContainer>
      <DiagramContainer>
        {renderContent()}
      </DiagramContainer>
    </AnimatedContainer>
  )
}

export default DiagramComponent
