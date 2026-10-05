import api from './api';

export const questionService = {
  async getQuestionsByQuizId(quizId) {
    const response = await api.get(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  async addQuestion(quizId, questionData) {
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  async updateQuestion(id, questionData) {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  async deleteQuestion(id) {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};

export default questionService;
