import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumbs from '../../components/breadcrumbs'
import { BreadcrumbsItem } from '../../components/breadcrumbs/breadcrumbs'
import { defaultColors } from '../../configs/colors'
import { RootState } from '../../store/reducers'
import { breadcrumbsOperations } from '../../store/reducers/breadcrumbs'
import { TitleContainer } from './style'

const TitleComponent: FC = () => {
  const dispatch = useDispatch()
  const breadcrumbsItemsMap = useSelector((state: RootState) => state.breadcrumbsReducer.breadcrumbsItemsMap)

  const [breadcrumbsItems, setBreadcrumbItems] = useState<BreadcrumbsItem[]>([])

  useEffect(() => {
    setBreadcrumbItems(getItems())
  }, [breadcrumbsItemsMap])

  const onBreadcrumbsUpdated = (breadcrumbsItem: BreadcrumbsItem): void => {
    breadcrumbsOperations.setUpdatedBreadcrumbsItem(breadcrumbsItem, dispatch)
  }

  const getItems = (): BreadcrumbsItem[] => {
    const items = Array.from(breadcrumbsItemsMap).sort((a, b) => a[0] - b[0])
    return items.map(item => item[1])
  }

  return (
    <TitleContainer data-testid='main-content-title'>
      <Breadcrumbs
        items={breadcrumbsItems}
        onLastItemChange={onBreadcrumbsUpdated}
        textLinkColor={defaultColors.primary.main}
        lastTextLinkColor={defaultColors.primary.dark} />
    </TitleContainer>
  )
}

export default TitleComponent
