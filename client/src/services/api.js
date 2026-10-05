import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quiznest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses for auth expiration or clean error format
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, clear storage if unauthorized on protected endpoints
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('quiznest_token');
        localStorage.removeItem('quiznest_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
