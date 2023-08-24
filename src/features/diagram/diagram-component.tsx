import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { BreadcrumbsItem } from '../../components/breadcrumbs/breadcrumbs'
import CircularProgress from '../../components/circular-progress'
import Diagram from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import { RootState } from '../../store/reducers'
import { breadcrumbsOperations } from '../../store/reducers/breadcrumbs'
import { diagramOperations } from '../../store/reducers/diagrams'
import { DiagramContainer } from './style'
import { addItemToNumericMap } from '../../utils/utils'

interface DiagramComponentProp {
  breadcrumbsItems: Map<number, BreadcrumbsItem>
}

const DiagramComponent: FC<DiagramComponentProp> = ({ breadcrumbsItems }: DiagramComponentProp) => {
  const { diagramId } = useParams()

  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [localBreadcrumbsItem, setLocalBreadcrumbsItem] = useState<BreadcrumbsItem | null>(null)

  const diagram: ObjectWrapper<Diagram> = useSelector((rootState: RootState) => rootState.diagramReducer.diagram)
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

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress />
      )
    }
    return (
      <div>
        Test {diagramId}
      </div>
    )
  }
  return (
    <DiagramContainer>
      {renderContent()}
    </DiagramContainer>
  )
}

export default DiagramComponent
