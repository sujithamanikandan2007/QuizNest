import api from './api';

export const resultService = {
  async submitQuiz(quizId, answers) {
    const response = await api.post('/results', { quizId, answers });
    return response.data;
  },

  async getMyResults() {
    const response = await api.get('/results/my-results');
    return response.data;
  },

  async getResultById(id) {
    const response = await api.get(`/results/${id}`);
    return response.data;
  },

  async getStudentProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Admin Services
  async getAdminStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllResultsAdmin(params = {}) {
    const response = await api.get('/admin/results', { params });
    return response.data;
  },

  async getAllStudentsAdmin() {
    const response = await api.get('/admin/students');
    return response.data;
  },

  async getStudentByIdAdmin(id) {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },
};

export default resultService;
