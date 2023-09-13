import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = "http://localhost:2137";
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
