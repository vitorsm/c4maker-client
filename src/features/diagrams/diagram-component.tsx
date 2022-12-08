import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedContainer from '../../components/animated-container'
import CircularProgress from '../../components/circular-progress'
import Diagram from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import { diagramOperations } from '../../store/reducers/diagrams'
import DiagramHeaderComponent from './diagram-header-component'

const DiagramComponent: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { diagramId } = useParams()

  const loadedDiagram: ObjectWrapper<Diagram> | undefined = useSelector((state: any) => state.diagramReducer.diagram)
  const persistedDiagram: ObjectWrapper<Diagram> | undefined = useSelector((state: any) => state.diagramReducer.persistedDiagram)

  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [diagram, setDiagram] = useState(loadedDiagram?.data)

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
