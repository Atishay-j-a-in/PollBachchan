const STORAGE_KEY = 'pollbachchan_auth'

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    return null
  }
}

export const getAccessToken = () => getStoredAuth()?.accessToken

export const setStoredAuth = (auth) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export const updateAccessToken = (accessToken) => {
  const existing = getStoredAuth()
  if (!existing) return
  setStoredAuth({ ...existing, accessToken })
}

export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}
