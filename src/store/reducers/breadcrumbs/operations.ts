import { Dispatch } from '@reduxjs/toolkit'
import { BreadcrumbsItem } from '../../../components/breadcrumbs/breadcrumbs'
import { BreadcrumbsTypes } from './reducer'

export const setBreadcrumbsItems = (breadcrumbsItems: BreadcrumbsItem[], dispatch: Dispatch<any>): void => {
  dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS_ITEMS, payload: breadcrumbsItems })
}

export const setUpdatedBreadcrumbsItem = (breadcrumbsItems: BreadcrumbsItem | null, dispatch: Dispatch<any>): void => {
  dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS, payload: breadcrumbsItems })
}
