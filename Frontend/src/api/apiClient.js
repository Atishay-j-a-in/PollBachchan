import axios from 'axios'
import {
  clearStoredAuth,
  getAccessToken,
  updateAccessToken,
} from '../utils/authStorage'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      try {
        const refresh = await refreshClient.post('/api/auth/refresh')
        const accessToken = refresh.data?.data?.accessToken
        if (accessToken) {
          updateAccessToken(accessToken)
          // Dispatch storage event to notify AuthContext
          window.dispatchEvent(
            new StorageEvent('storage', {
              key: 'pollbachchan_auth',
              newValue: localStorage.getItem('pollbachchan_auth'),
              storageArea: localStorage,
            })
          )
          original.headers.authorization = `Bearer ${accessToken}`
          return apiClient(original)
        }
      } catch (refreshError) {
        clearStoredAuth()
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
