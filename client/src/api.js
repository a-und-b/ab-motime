import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api'  // Stellen Sie sicher, dass dies mit Ihrem Backend-Port übereinstimmt
})

export const getTimingData = async () => {
  const response = await api.get('/timing')
  return response.data
}

export const addMocoEntry = async (entry) => {
  const response = await api.post('/moco', entry)
  return response.data
}
