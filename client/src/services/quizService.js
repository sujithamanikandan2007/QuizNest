import api from './api';

export const quizService = {
  async getQuizzes() {
    const response = await api.get('/quizzes');
    return response.data;
  },

  async getQuizById(id) {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  async createQuiz(quizData) {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  async updateQuiz(id, quizData) {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  async deleteQuiz(id) {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
};

export default quizService;
