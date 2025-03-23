import { Dispatch } from '@reduxjs/toolkit'
import { BreadcrumbsItem } from '../../../components/breadcrumbs/breadcrumbs'
import { BreadcrumbsTypes } from './reducer'

export const setBreadcrumbsMap = async (breadcrumbsItemsMap: Map<number, BreadcrumbsItem>, dispatch: Dispatch<any>): Promise<void> => {
  await dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS_MAP, payload: breadcrumbsItemsMap })
}

export const setUpdatedBreadcrumbsItem = (breadcrumbsItems: BreadcrumbsItem | null, dispatch: Dispatch<any>): void => {
  dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS, payload: breadcrumbsItems })
}
