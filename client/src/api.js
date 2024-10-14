import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export const getTimingData = async () => {
  try {
    const response = await api.get('/timing')
    return response.data
  } catch (error) {
    console.error('Error fetching Timing data:', error)
    throw error
  }
}

export const addMocoEntry = async (entry) => {
  try {
    const response = await api.post('/moco/activities', entry)
    return response.data
  } catch (error) {
    console.error('Error adding Moco entry:', error)
    throw error
  }
}

export const getMocoProjects = async () => {
  try {
    const response = await api.get('/moco/projects')
    return response.data
  } catch (error) {
    console.error('Error fetching Moco projects:', error)
    throw error
  }
}

export const getMocoTasks = async (projectId) => {
  try {
    const response = await api.get(`/moco/projects/${projectId}/tasks`)
    return response.data
  } catch (error) {
    console.error('Error fetching Moco tasks:', error)
    throw error
  }
}
