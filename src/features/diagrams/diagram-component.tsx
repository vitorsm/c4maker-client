import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AnimatedContainer from '../../components/animated-container'
import CircularProgress from '../../components/circular-progress'
import PlainButton from '../../components/plain-button'
import TextInput from '../../components/text-input'
import Diagram from '../../models/diagram'
import ObjectWrapper from '../../models/object_wrapper'
import { diagramOperations } from '../../store/reducers/diagrams'

const DiagramComponent: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { diagramId } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [diagramName, setDiagramName] = useState(null)
  const [diagramDescription, setDiagramDescription] = useState(null)

  const diagram: ObjectWrapper<Diagram> | undefined = useSelector((state: any) => state.diagramReducer.diagram)

  const shouldRequestDiagram = (): boolean => {
    return diagramId !== undefined && (diagram === undefined || diagram?.data?.id !== diagramId)
  }

  useEffect(() => {
    if (shouldRequestDiagram() && diagramId !== undefined) {
      void diagramOperations.fetchDiagram(diagramId, dispatch)
      setIsLoading(true)
    }
  })

  useEffect(() => {
    if (diagram !== undefined) {
      setIsLoading(false)
    }
  }, [diagram])

  const handleCancelOnClick = (): void => {
    navigate(-1)
  }

  const handleSaveOnClick = async (): Promise<void> => {
    if (diagramName === null || diagramDescription === null) {
      return
    }

    const newDiagram = {
      name: diagramName,
      description: diagramDescription
    }

    void diagramOperations.createDiagram(newDiagram, dispatch)
    setIsLoading(true)
  }

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return (
        <CircularProgress />
      )
    }

    return (
      <>
        <TextInput title='Name' onChange={setDiagramName}/>
        <TextInput title='Description' type='text-area' fillWidth onChange={setDiagramDescription}/>

        <PlainButton text='Cancelar' onClick={handleCancelOnClick} />
        <PlainButton text='Salvar' onClick={handleSaveOnClick}/>
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
