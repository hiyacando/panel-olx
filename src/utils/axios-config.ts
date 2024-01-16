import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = "http://192.168.100.100:2137";
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((config) => {
  const authToken = Cookies.get("authToken");
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});

export default axiosInstance;
