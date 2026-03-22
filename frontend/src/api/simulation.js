import axios from 'axios'

const BASE_URL = import.meta.env.DEV ? 'http://localhost:8000' : ''

export async function simulateData(modelExpression, data) {
  const response = await axios.post(`${BASE_URL}/simulate`, {
    model: modelExpression,
    data: data
  })
  return response.data
}
