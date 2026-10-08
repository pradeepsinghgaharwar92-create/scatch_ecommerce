import axios from "axios";
import toast from "react-hot-toast";
console.log("API URL:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", error);

    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;