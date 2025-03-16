import { useDispatch, useSelector } from 'react-redux'
import { BreadcrumbsItem } from '../../../components/breadcrumbs/breadcrumbs'
import { RootState } from '..'
import { breadcrumbsOperations } from '.'
import { addItemToNumericMap, removeBiggerItemsFromNumericMap } from '../../../utils/utils'
import { useEffect } from 'react'

interface BreadcrumbsHookResponse {
  addBreadcrumbItem: (item: BreadcrumbsItem, index?: number) => void
}

export default function useBreadcrumbs (onItemUpdate?: (item: BreadcrumbsItem) => void): BreadcrumbsHookResponse {
  const dispatch = useDispatch()
  const breadcrumbItemsMap: Map<number, BreadcrumbsItem> = useSelector((state: RootState) => state.breadcrumbsReducer.breadcrumbsItemsMap)
  const updatedBreadcrumbsItem: BreadcrumbsItem | null = useSelector((state: RootState) => state.breadcrumbsReducer.updatedBreadcrumbsItem)

  useEffect(() => {
    if (updatedBreadcrumbsItem == null) {
      return
    }

    if (onItemUpdate !== undefined) {
      onItemUpdate(updatedBreadcrumbsItem)
    }
  }, [updatedBreadcrumbsItem])

  const addBreadcrumbItem = (item: BreadcrumbsItem, index?: number): void => {
    const breadcrumbItemsMapWithtouNull = new Map()
    breadcrumbItemsMap.forEach((_item, key) => {
      if (_item.key !== null) {
        breadcrumbItemsMapWithtouNull.set(key, _item)
      }
    })

    const breadcrumbItemsList = Array.from(breadcrumbItemsMapWithtouNull.values())
    const itemInBreadcrumb: BreadcrumbsItem | undefined = breadcrumbItemsList.find(_item => _item.key === item.key)

    // If this item is already in the breadcrumbs, we need to remove the items after that.
    // For example, this is the current breadcrumbs: Workspaces > W1 > Item 1
    // If the item to be inserted is Workspaces, we need to remove W1 and Item 1 from the breadcrumbs because the user return to the first item
    // If the item is not part of the breadcrumb yet we only need to add it
    const newBreadcrumbItemsMap = itemInBreadcrumb !== undefined ? removeBiggerItemsFromNumericMap(breadcrumbItemsMapWithtouNull, item, (a, b) => a.key === b.key) : addItemToNumericMap(breadcrumbItemsMapWithtouNull, item, index)

    void breadcrumbsOperations.setBreadcrumbsMap(newBreadcrumbItemsMap, dispatch)
  }

  return { addBreadcrumbItem }
}
