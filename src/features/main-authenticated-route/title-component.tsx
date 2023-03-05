import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumbs from '../../components/breadcrumbs'
import { BreadcrumbsItem } from '../../components/breadcrumbs/breadcrumbs'
import { defaultColors } from '../../configs/colors'
import { RootState } from '../../store/reducers'
import { breadcrumbsOperations } from '../../store/reducers/breadcrumbs'
import { TitleContainer } from './style'

const TitleComponent: FC = () => {
  const dispatch = useDispatch()
  const breadcrumbItems = useSelector((state: RootState) => state.breadcrumbsReducer.breadcrumbsItems)

  useEffect(() => {
    breadcrumbsOperations.setUpdatedBreadcrumbsItem(null, dispatch)
  }, [breadcrumbItems])

  const onBreadcrumbsUpdated = (breadcrumbsItem: BreadcrumbsItem): void => {
    breadcrumbsOperations.setUpdatedBreadcrumbsItem(breadcrumbsItem, dispatch)
  }

  return (
    <TitleContainer data-testid='main-content-title'>
      <Breadcrumbs
        items={breadcrumbItems}
        onLastItemChange={onBreadcrumbsUpdated}
        textLinkColor={defaultColors.primary.main}
        lastTextLinkColor={defaultColors.primary.dark}
        dataTestId={'main-title-breadcrumbs'} />
    </TitleContainer>
  )
}

export default TitleComponent
