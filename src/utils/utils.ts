
export const addItemToNumericMap = (map: Map<number, any>, item: any): Map<number, any> => {
  let maxKey = 0
  map.forEach((_, key) => {
    if (key > maxKey) {
      maxKey = key
    }
  })

  const newMap = new Map(map)
  newMap.set(maxKey + 1, item)

  return newMap
}
