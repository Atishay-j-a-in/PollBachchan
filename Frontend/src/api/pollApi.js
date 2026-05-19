import apiClient from './apiClient'

export const getAllPolls = async () => {
  const response = await apiClient.get('/api/poll/getAll')
  return response.data?.data ?? []
}

export const getParticipants = async (pollId) => {
  const response = await apiClient.get('/api/poll/participants', {
    params: { id: pollId },
  })
  return response.data?.data?.totalParticipants ?? 0
}

export const getPollForm = async (pollId) => {
  const response = await apiClient.get('/api/poll/form', {
    params: { id: pollId },
  })
  return response.data?.data
}

export const submitPoll = async (pollId, responses) => {
  const response = await apiClient.post('/api/user/submit', {
    responses,
  }, {
    params: { id: pollId },
  })
  return response.data?.data
}

export const createPoll = async (payload) => {
  const response = await apiClient.post('/api/user/create', payload)
  return response.data?.data
}

export const getAnalytics = async (pollId) => {
  const response = await apiClient.get('/api/poll/analytics', {
    params: { id: pollId },
  })
  return response.data?.data?.analytics
}

export const getUserSummary = async (pollId) => {
  const response = await apiClient.get('/api/poll/summary', {
    params: { id: pollId },
  })
  return response.data?.data?.summary
}

export const getPollDetails = async (pollId) => {
  const response = await apiClient.get('/api/poll/details', {
    params: { id: pollId },
  })
  return response.data?.data
}

export const publishResults = async (pollId, isPublished) => {

  const response = await apiClient.post('/api/user/publish', {
    isPublished,
  }, {
    params: { id: pollId },
  })

  return response.data?.data
}

export const deletePoll = async (pollId) => {
  const response = await apiClient.post('/api/user/delete', {}, {
    params: { id: pollId },
  })
  return response.data?.data
}
