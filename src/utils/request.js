import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data',
  timeout: 3000,
})

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization =
      'Apikey 2069a9f703a37f714d1a29a5d7bdf69c77ba0e98e4c8a91684dcae3436d24483'
    return config
  },
  (error) => Promise.reject(error)
)
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => Promise.reject(error)
)
export default instance
