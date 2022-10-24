import { Dispatch } from 'react'
import DiagramService from '../../../services/diagram_service'
import { DiagramsTypes } from './types'

export const fetchUserDiagrams = async (dispatch: Dispatch<any>): Promise<void> => {
  new DiagramService().getDiagrams(dispatch, DiagramsTypes.GET_USER_DIAGRAMS)
}
