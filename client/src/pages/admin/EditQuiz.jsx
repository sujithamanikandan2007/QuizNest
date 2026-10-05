import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../../services/quizService';
import Button from '../../components/Button';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    difficulty: 'Medium',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuizById(id);
        setFormData({
          title: data.title || '',
          category: data.category || '',
          description: data.description || '',
          difficulty: data.difficulty || 'Medium',
        });
      } catch (err) {
        console.error('Error fetching quiz details:', err);
        setError('Failed to fetch quiz details.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { title, category, description, difficulty } = formData;
    if (!title || !category || !description) {
      setError('Please provide title, category, and description.');
      return;
    }

    try {
      setSaving(true);
      await quizService.updateQuiz(id, {
        title,
        category,
        description,
        difficulty,
      });
      setSuccess('Quiz updated successfully.');
      setTimeout(() => {
        navigate('/admin/quizzes');
      }, 1000);
    } catch (err) {
      console.error('Error updating quiz:', err);
      setError(err.response?.data?.message || 'Failed to update quiz.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <p style={{ color: '#64748b' }}>Loading quiz configuration...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <div className="page-header">
        <h1 className="page-title">Edit Quiz</h1>
        <p className="page-subtitle">Update quiz details, category or difficulty rating.</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
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
            <label className="form-label" htmlFor="edit-title">
              Quiz Title *
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-category">
              Category *
            </label>
            <input
              id="edit-category"
              name="category"
              type="text"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-difficulty">
              Difficulty Level
            </label>
            <select
              id="edit-difficulty"
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
            <label className="form-label" htmlFor="edit-description">
              Description *
            </label>
            <textarea
              id="edit-description"
              name="description"
              className="form-control"
              rows={4}
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
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
