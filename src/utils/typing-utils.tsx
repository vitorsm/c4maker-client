
export const getBoolean = (input: boolean | null | undefined): boolean => {
  return input ?? false
}

export const getString = (input: string | null | undefined): string => {
  return input ?? ''
}

export const getNumber = (input: number | null | undefined): number => {
  return input ?? 0
}
