import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { BreadcrumbsItem } from '../../components/breadcrumbs/breadcrumbs'
import CircularProgress from '../../components/circular-progress'
import Diagram, { DiagramItem } from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import { RootState } from '../../store/reducers'
import { breadcrumbsOperations } from '../../store/reducers/breadcrumbs'
import { diagramOperations } from '../../store/reducers/diagrams'
import { DiagramContainer } from './style'
import { addItemToNumericMap } from '../../utils/utils'
import DiagramItemsComponent from '../../components/diagram-items-component'
import AnimatedContainer from '../../components/animated-container'

interface DiagramComponentProp {
  breadcrumbsItems: Map<number, BreadcrumbsItem>
}

const DiagramComponent: FC<DiagramComponentProp> = ({ breadcrumbsItems }: DiagramComponentProp) => {
  const { diagramId } = useParams()

  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [localBreadcrumbsItem, setLocalBreadcrumbsItem] = useState<BreadcrumbsItem | null>(null)
  const [diagramItems, setDiagramItems] = useState<DiagramItem[]>([])

  const diagram: ObjectWrapper<Diagram> = useSelector((rootState: RootState) => rootState.diagramReducer.diagram)
  console.log('diagram', diagram)

  const breadcrumbItemsMap: Map<number, BreadcrumbsItem> = useSelector((state: RootState) => state.breadcrumbsReducer.breadcrumbsItemsMap)

  useEffect(() => {
    fetchDiagram()
  }, [diagramId])

  useEffect(() => {
    setIsLoading(false)
    generateBreadcrumbsItem()
  }, [diagram])

  useEffect(() => {
    if (localBreadcrumbsItem === null) {
      return
    }

    const newBreadcrumbItems = addItemToNumericMap(breadcrumbsItems, localBreadcrumbsItem)

    void breadcrumbsOperations.addBreadcrumbsItemsMap(newBreadcrumbItems, dispatch, breadcrumbItemsMap)
  }, [localBreadcrumbsItem, breadcrumbsItems])

  const generateBreadcrumbsItem = (): void => {
    if (diagram.data === null || diagram.data.id === undefined) {
      return
    }

    setLocalBreadcrumbsItem({
      key: diagram.data.id,
      name: diagram.data.name,
      details: diagram.data.description,
      onClick: () => {},
      editable: true
    })
  }

  const fetchDiagram = (): void => {
    if (diagramId === null || diagramId === undefined) {
      return
    }

    void diagramOperations.fetchDiagram(diagramId, dispatch)
    setIsLoading(true)
  }

  const onDiagramItemAdded = (diagramItem: DiagramItem): void => {
    setDiagramItems([...diagramItems, diagramItem])
  }

  const onDiagramItemChange = (newDiagramItems: DiagramItem[]): void => {
    const diagramItemKeys = newDiagramItems.map(diagramItem => diagramItem.workspaceItem.key)

    const persistedDiagramMap = new Map()
    diagramItems.filter(diagramItem => diagramItemKeys.includes(diagramItem.workspaceItem.key)).forEach(diagramItem => {
      persistedDiagramMap.set(diagramItem.workspaceItem.key, diagramItem)
    })

    newDiagramItems.forEach(newDiagramItem => {
      const diagramItem = persistedDiagramMap.get(newDiagramItem.workspaceItem.key)

      diagramItem.canvasData = newDiagramItem.canvasData
      diagramItem.isSelected = newDiagramItem.isSelected
      diagramItem.workspaceItem = newDiagramItem.workspaceItem
    })

    setDiagramItems([...diagramItems])
  }

  const onDiagramItemDeleted = (diagramItemsToDelete: DiagramItem[]): void => {
    const itemKeys = diagramItemsToDelete.map(diagramItem => diagramItem.workspaceItem.key)

    setDiagramItems(diagramItems.filter(diagramItem => !itemKeys.includes(diagramItem.workspaceItem.key)))
  }

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress />
      )
    }
    return (
      <DiagramItemsComponent
        diagramItems={diagramItems}
        onDiagramItemChange={onDiagramItemChange}
        onDiagramItemAdded={onDiagramItemAdded}
        onDiagramItemDeleted={onDiagramItemDeleted} />
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
