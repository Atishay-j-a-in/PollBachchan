import apiClient from './apiClient'

export const login = async (payload) => {
  const response = await apiClient.post('/api/auth/login', payload)
  return response.data?.data
}

export const register = async (payload) => {
  const response = await apiClient.post('/api/auth/register', payload)
  return response.data?.data
}

export const logout = async () => {
  const response = await apiClient.post('/api/auth/logout')
  return response.data
}
