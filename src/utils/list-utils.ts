
export const updateItemInList = (item: NonNullable<any>, list: any[] | null, getItemId: (item: any) => any): object[] => {
  if (list == null) {
    return [item]
  }

  const itemId = getItemId(item)
  const itemOnList = list.find(_item => getItemId(_item) === itemId)
  const itemIsAlreadyInTheList = itemOnList != null

  if (itemIsAlreadyInTheList) {
    return list.map(_item => {
      if (getItemId(_item) === itemId) {
        return item
      }
      return _item
    })
  }

  return [item, ...list]
}
