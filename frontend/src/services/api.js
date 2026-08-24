import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: '', // Uses the current origin (proxied during dev, same origin in prod)
  withCredentials: true, // Crucial to send/receive authentication cookies
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', error);
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
