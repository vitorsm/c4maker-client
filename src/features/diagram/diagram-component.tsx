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

  const diagram: ObjectWrapper<Diagram> = useSelector((rootState: RootState) => rootState.diagramReducer.diagram)

  useEffect(() => {
    fetchDiagram()
  }, [diagramId])

  useEffect(() => {
    setIsLoading(false)
    generateBreadcrumbsItem()
  }, [diagram])

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
