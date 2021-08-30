import axios from "axios";

const instance = axios.create({
  baseURL: "https://min-api.cryptocompare.com/data",
  timeout: 1000,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => Promise.reject(error)
);
export default instance;
