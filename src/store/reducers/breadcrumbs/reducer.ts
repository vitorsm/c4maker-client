import { Reducer } from 'redux'
import { BreadcrumbsItem } from '../../../components/breadcrumbs/breadcrumbs'

export enum BreadcrumbsTypes {
  SET_BREADCRUMBS_ITEMS = '@breadcrumbs/SET_BREADCRUMBS_ITEMS',
  SET_BREADCRUMBS = '@breadcrumbs/SET_BREADCRUMBS',
  SET_BREADCRUMBS_MAP = '@breadcrumbs/SET_BREADCRUMBS_MAP'
}

export interface BreadcrumbsState {
  breadcrumbsItems: BreadcrumbsItem[]
  updatedBreadcrumbsItem: BreadcrumbsItem | null
  breadcrumbsItemsMap: Map<number, BreadcrumbsItem>
}

const INITIAL_STATE: BreadcrumbsState = {
  breadcrumbsItems: [],
  updatedBreadcrumbsItem: null,
  breadcrumbsItemsMap: new Map()
}

const reducer: Reducer<BreadcrumbsState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BreadcrumbsTypes.SET_BREADCRUMBS_ITEMS:
      return {
        ...state,
        breadcrumbsItems: action.payload
      }
    case BreadcrumbsTypes.SET_BREADCRUMBS:
      return {
        ...state,
        updatedBreadcrumbsItem: action.payload
      }
    case BreadcrumbsTypes.SET_BREADCRUMBS_MAP:
      return {
        ...state,
        breadcrumbsItemsMap: action.payload
      }
    default:
      return state
  }
}

export default reducer
