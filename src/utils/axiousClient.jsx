import axios from "axios";
import { API_BASE_URL } from "../config/ApiConfig";
import { getToken } from "./storage";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // QUAN TRỌNG: để cookie httpOnly gửi kèm
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosClient };
