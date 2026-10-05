import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('quiznest_token', response.data.token);
      localStorage.setItem('quiznest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('quiznest_token', response.data.token);
      localStorage.setItem('quiznest_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('quiznest_token');
    localStorage.removeItem('quiznest_user');
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('quiznest_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('quiznest_token');
  },
};

export default authService;
