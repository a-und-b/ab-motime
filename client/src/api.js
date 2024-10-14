import axios from 'axios'

const api = axios.create({
  baseURL: '/api'  // This will use the relative path, which will work with our new setup
})

export const getTimingData = async () => {
  const response = await api.get('/timing')
  return response.data
}

export const addMocoEntry = async (entry) => {
  const response = await api.post('/moco', entry)
  return response.data
}
