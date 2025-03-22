import { act } from '@testing-library/react'
import { BreadcrumbsTypes } from '../store/reducers/breadcrumbs/reducer'
import { BreadcrumbsItem } from '../components/breadcrumbs/breadcrumbs'
import User from '../models/user'
import { UserTypes } from '../store/reducers/users/reducer'

export const mockChangeInBreadcrumbs = (store: any, breadcrumbItem: BreadcrumbsItem): void => {
  act(() => {
    store.dispatch({
      type: BreadcrumbsTypes.SET_BREADCRUMBS,
      payload: breadcrumbItem
    })
  })
}

export const mockLoadCurrentUser = (store: any, userName?: string, userLogin?: string): void => {
  const mockCurrentUser: User = {
    name: userName ?? 'UserName',
    login: userLogin ?? 'login'
  }

  act(() => {
    store.dispatch({
      type: UserTypes.SET_CURRENT_USER,
      payload: mockCurrentUser
    })
  })
}

test('only to avoid error', () => {})
