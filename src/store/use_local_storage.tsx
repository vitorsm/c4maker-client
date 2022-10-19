// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react'

export const useLocalStorage = (key: string, initialValue: string | null): [string | null, Function] => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item !== '' ? item : null
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: string): void => {
    try {
      setStoredValue(value)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue]
}
