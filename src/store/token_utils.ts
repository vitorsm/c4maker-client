
const TOKEN_KEY = 'access_token'

export const getToken = (): string | null => {
  const token = window.localStorage.getItem(TOKEN_KEY)
  return token === '' ? null : token
}

export const setToken = (accessToken: string | null): void => {
  window.localStorage.setItem(TOKEN_KEY, accessToken === null ? '' : accessToken)
}
