import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import Button from '../../components/Button';

const AddQuiz = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    difficulty: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { title, category, description, difficulty } = formData;
    if (!title || !category || !description) {
      setError('Please provide title, category, and description.');
      return;
    }

    try {
      setLoading(true);
      const res = await quizService.createQuiz({
        title,
        category,
        description,
        difficulty,
      });
      // Navigate to questions management for the newly created quiz so the admin can add questions immediately
      navigate(`/admin/quizzes/${res.quiz._id}/questions`);
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(err.response?.data?.message || 'Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div className="page-header">
        <h1 className="page-title">Create New Quiz</h1>
        <p className="page-subtitle">
          Define quiz metadata and categorization before attaching questions.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="quiz-title">
              Quiz Title *
            </label>
            <input
              id="quiz-title"
              name="title"
              type="text"
              className="form-control"
              placeholder="e.g. Java Fundamentals"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="quiz-category">
              Category *
            </label>
            <input
              id="quiz-category"
              name="category"
              type="text"
              className="form-control"
              placeholder="e.g. Programming, Databases, Networking"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="quiz-difficulty">
              Difficulty Level
            </label>
            <select
              id="quiz-difficulty"
              name="difficulty"
              className="form-control"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="quiz-description">
              Description *
            </label>
            <textarea
              id="quiz-description"
              name="description"
              className="form-control"
              rows={4}
              placeholder="Brief summary of skills and topics assessed by this quiz..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end',
              paddingTop: '1.25rem',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/quizzes')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Save & Add Questions'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
