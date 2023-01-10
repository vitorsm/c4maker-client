import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedContainer from '../../components/animated-container'
import CircularProgress from '../../components/circular-progress'
import DiagramItemsComponent from '../../components/diagram-items-component'
import Diagram, { DiagramItem, DiagramItemType } from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import { diagramOperations } from '../../store/reducers/diagrams'
import DiagramHeaderComponent from './diagram-header-component'

const DIAGRAM_ITEMS = [
  {
    id: 'id1',
    key: 'id1',
    name: 'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',
    itemDescription: '[description 1]',
    details: 'details asdfoiajsdfiojasdfoasdfiojaiodfj',
    itemType: DiagramItemType.PERSON,
    diagram: null,
    parent: null,
    relationships: [],
    canvasData: {
      position: null,
      color: null
    }
  }, {
    id: 'id2',
    key: 'id2',
    name: 'name 2 item',
    itemDescription: '[description 2]',
    details: 'details 2asdfoiajsdfiojasdfoasdfiojaiodfjasdfoiajsdfiojasdfoasdfiojaiodfj',
    itemType: DiagramItemType.CONTAINER,
    diagram: null,
    parent: null,
    relationships: [],
    canvasData: {
      position: null,
      color: null
    }
  }
]

// const DIAGRAM_ITEMS = [
//   {
//     id: 'id1',
//     name: 'name 1',
//     itemDescription: 'description 1',
//     details: 'details 1',
//     itemType: DiagramItemType.PERSON,
//     diagram: null,
//     parent: null,
//     relationships: [],
//     position: null
//   }
// ]

const DiagramComponent: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { diagramId } = useParams()

  const loadedDiagram: ObjectWrapper<Diagram> | undefined = useSelector((state: any) => state.diagramReducer.diagram)
  const persistedDiagram: ObjectWrapper<Diagram> | undefined = useSelector((state: any) => state.diagramReducer.persistedDiagram)

  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [diagram, setDiagram] = useState(loadedDiagram?.data)
  const [diagramItems, setDiagramItems] = useState<DiagramItem[]>(DIAGRAM_ITEMS)

  const shouldRequestDiagram = (): boolean => {
    return diagramId !== undefined && (loadedDiagram === undefined || loadedDiagram?.data?.id !== diagramId) && loadedDiagram?.error !== true
  }

  useEffect(() => {
    if (diagramId === undefined && diagramId !== null) {
      setIsCreating(true)
    } else {
      setIsCreating(false)
    }

    if (shouldRequestDiagram() && diagramId !== undefined) {
      void diagramOperations.fetchDiagram(diagramId, dispatch)
      setIsLoading(true)
    }

    console.log('define the first diagramItems')
  })

  useEffect(() => {
    if (loadedDiagram !== undefined) {
      setIsLoading(false)
      setDiagram(loadedDiagram.data)
    }
  }, [loadedDiagram])

  useEffect(() => {
    if (persistedDiagram !== undefined) {
      setIsLoading(false)

      if (!persistedDiagram.error) {
        setDiagram(persistedDiagram.data)

        if (isCreating && ((persistedDiagram?.data?.id) != null)) {
          navigate(`/diagrams/${persistedDiagram?.data?.id}`)
        }
      }
    }
  }, [persistedDiagram])

  const handleCancelOnClick = (): void => {
    if (isCreating) {
      navigate(-1)
    }
  }

  const handleOnCloseCallback = (): void => {
    navigate(-1)
  }

  const onDiagramItemChange = (newDiagramItems: DiagramItem[]): void => {
    console.log('onDiagramItemChange')

    const diagramItemIds = newDiagramItems.map(diagramItem => diagramItem.id)
    const persistedDiagramMap = new Map()
    diagramItems.filter(diagramItem => diagramItemIds.includes(diagramItem.id)).forEach(diagramItem => {
      persistedDiagramMap.set(diagramItem.id, diagramItem)
    })

    newDiagramItems.forEach(newDiagramItem => {
      const diagramItem = persistedDiagramMap.get(newDiagramItem.id)
      diagramItem.canvasData = newDiagramItem.canvasData
      diagramItem.isSelected = newDiagramItem.isSelected
      diagramItem.name = newDiagramItem.name
      diagramItem.itemDescription = newDiagramItem.itemDescription
      diagramItem.details = newDiagramItem.details
    })

    setDiagramItems([...diagramItems])
  }

  const onDiagramItemAdded = (diagramItem: DiagramItem): void => {
    console.log('will add diagramItem', diagramItem)
    setDiagramItems([...diagramItems, diagramItem])
  }
  const onDiagramItemDeleted = (diagramItemsToDelete: DiagramItem[]): void => {
    console.log('will delete', diagramItemsToDelete)
    const itemKeys = diagramItemsToDelete.map(diagramItem => diagramItem.key)

    setDiagramItems(diagramItems.filter(diagramItem => !itemKeys.includes(diagramItem.key)))
  }

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress />
      )
    }

    return (
      <>
        <DiagramHeaderComponent
          diagram={diagram}
          isCreating={isCreating}
          cancelCallback={handleCancelOnClick}
          closeCallback={handleOnCloseCallback}
          isLoadingDiagram={isLoading} />

          <DiagramItemsComponent
            diagramItems={diagramItems}
            onDiagramItemChange={onDiagramItemChange}
            onDiagramItemAdded={onDiagramItemAdded}
            onDiagramItemDeleted={onDiagramItemDeleted} />
      </>
    )
  }

  return (
    <AnimatedContainer>
      {renderContent()}
    </AnimatedContainer>
  )
}

export default DiagramComponent
