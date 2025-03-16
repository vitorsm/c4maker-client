
export const addItemToNumericMap = (map: Map<number, any>, item: any, index?: number): Map<number, any> => {
  let maxKey = 0
  map.forEach((_, key) => {
    if (key > maxKey) {
      maxKey = key
    }
  })

  const newKey = index === undefined ? maxKey + 1 : index
  const newMap = new Map(map)
  newMap.set(newKey, item)

  return newMap
}

export const removeBiggerItemsFromNumericMap = (map: Map<number, any>, item: any, functionToCompare: (_item1: any, _item2: any) => boolean): Map<number, any> => {
  let itemKey = -1
  map.forEach((_item, key) => {
    if (functionToCompare(item, _item)) {
      itemKey = key
    }
  })

  if (itemKey < 0) {
    return map
  }

  const newMap = new Map()
  map.forEach((_item, key) => {
    if (key <= itemKey) {
      newMap.set(key, _item)
    }
  })

  return newMap
}
