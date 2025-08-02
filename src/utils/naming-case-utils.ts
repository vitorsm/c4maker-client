
export const snakeToCamel = (obj: Record<string, any>): Record<string, any> => {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      acc[camelKey] = snakeToCamel(obj[key]) // Recursively convert nested objects
      return acc
    }, {})
  }
  return obj
}

export const camelToSnake = (obj: Record<string, any>): Record<string, any> => {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      acc[snakeKey] = camelToSnake(obj[key]) // Recursively convert nested objects
      return acc
    }, {})
  }
  return obj
}
