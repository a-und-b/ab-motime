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
    const response = await api.post('/moco', entry)
    return response.data
  } catch (error) {
    console.error('Error adding Moco entry:', error)
    throw error
  }
}
