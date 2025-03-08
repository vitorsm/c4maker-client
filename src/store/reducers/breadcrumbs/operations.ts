import { Dispatch } from '@reduxjs/toolkit'
import { BreadcrumbsItem } from '../../../components/breadcrumbs/breadcrumbs'
import { BreadcrumbsTypes } from './reducer'

const MAXIMUM_TIME_TO_CONSIDER = 1000

export const addBreadcrumbsItemsMap = async (breadcrumbsItemsMap: Map<number, BreadcrumbsItem>, dispatch: Dispatch<any>, currentBreadcrumbsItemsMap: Map<number, BreadcrumbsItem> | null = null): Promise<void> => {
  await dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS_MAP, payload: generateNewBreadcrumbsItems(breadcrumbsItemsMap, currentBreadcrumbsItemsMap) })
}

const generateNewBreadcrumbsItems = (breadcrumbsItemsMap: Map<number, BreadcrumbsItem>, currentBreadcrumbsItemsMap: Map<number, BreadcrumbsItem> | null): Map<number, BreadcrumbsItem> => {
  const newBreadcrumbsItemsMap = new Map(breadcrumbsItemsMap)

  if (currentBreadcrumbsItemsMap === null) {
    return newBreadcrumbsItemsMap
  }

  currentBreadcrumbsItemsMap.forEach((item, key) => {
    const shouldAddItem = newBreadcrumbsItemsMap.get(key) === undefined && item.timestamp !== undefined && Date.now() - item.timestamp < MAXIMUM_TIME_TO_CONSIDER
    if (shouldAddItem) {
      newBreadcrumbsItemsMap.set(key, item)
    }
  })

  fillBreadcrumbsTimestamp(newBreadcrumbsItemsMap)

  return newBreadcrumbsItemsMap
}

const fillBreadcrumbsTimestamp = (breadcrumbsItemsMap: Map<number, BreadcrumbsItem>): void => {
  const currentTimestamp = Date.now()
  breadcrumbsItemsMap.forEach(item => {
    item.timestamp = currentTimestamp
  })
}

export const setBreadcrumbsItems = (breadcrumbsItems: BreadcrumbsItem[], dispatch: Dispatch<any>): void => {
  dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS_ITEMS, payload: breadcrumbsItems })
}

export const setUpdatedBreadcrumbsItem = (breadcrumbsItems: BreadcrumbsItem | null, dispatch: Dispatch<any>): void => {
  dispatch({ type: BreadcrumbsTypes.SET_BREADCRUMBS, payload: breadcrumbsItems })
}
