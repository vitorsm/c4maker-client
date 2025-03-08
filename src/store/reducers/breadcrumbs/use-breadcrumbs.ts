import { useDispatch, useSelector } from 'react-redux'
import { BreadcrumbsItem } from '../../../components/breadcrumbs/breadcrumbs'
import { RootState } from '..'
import { breadcrumbsOperations } from '.'
import { addItemToNumericMap } from '../../../utils/utils'

interface BreadcrumbsHookResponse {
  addBreadcrumbItem: (item: BreadcrumbsItem) => void
}

export default function useBreadcrumbs (): BreadcrumbsHookResponse {
  const dispatch = useDispatch()
  const breadcrumbItemsMap: Map<number, BreadcrumbsItem> = useSelector((state: RootState) => state.breadcrumbsReducer.breadcrumbsItemsMap)

  const addBreadcrumbItem = (item: BreadcrumbsItem): void => {
    const newBreadcrumbItem = addItemToNumericMap(breadcrumbItemsMap, item)
    void breadcrumbsOperations.addBreadcrumbsItemsMap(newBreadcrumbItem, dispatch, breadcrumbItemsMap)
  }

  return { addBreadcrumbItem }
}
