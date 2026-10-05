import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete modal state
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to fetch quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;
    try {
      setIsDeleting(true);
      await quizService.deleteQuiz(quizToDelete._id);
      setSuccess(`Quiz "${quizToDelete.title}" and its questions were deleted.`);
      setQuizToDelete(null);
      await fetchQuizzes();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError(err.response?.data?.message || 'Failed to delete quiz.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'badge-easy';
      case 'hard':
        return 'badge-hard';
      case 'medium':
      default:
        return 'badge-medium';
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 className="page-title">Manage Quizzes</h1>
          <p className="page-subtitle">
            Create, edit, and organize assessment modules and curriculum quizzes.
          </p>
        </div>

        <Link to="/admin/quizzes/new" className="btn btn-primary">
          + Create Quiz
        </Link>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading quizzes...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No quizzes created yet</h3>
          <p className="empty-state-desc">
            Get started by creating your first quiz to begin adding questions.
          </p>
          <Link to="/admin/quizzes/new" className="btn btn-primary">
            + Create New Quiz
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Questions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td>
                    <div>
                      <strong style={{ color: '#1e293b' }}>{quiz.title}</strong>
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        maxWidth: '380px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {quiz.description}
                    </div>
                  </td>
                  <td>{quiz.category}</td>
                  <td>
                    <span className={`badge ${getDifficultyBadge(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </td>
                  <td>
                    <strong>{quiz.questionCount ?? 0}</strong>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '0.4rem',
                        alignItems: 'center',
                      }}
                    >
                      <Link
                        to={`/admin/quizzes/${quiz._id}/questions`}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#2563eb' }}
                      >
                        Manage Questions
                      </Link>
                      <Link
                        to={`/admin/quizzes/${quiz._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(quiz)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!quizToDelete}
        title="Delete Quiz Confirmation"
        onClose={() => setQuizToDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmText="Delete Quiz"
        confirmVariant="danger-solid"
        isLoading={isDeleting}
      >
        <p style={{ marginBottom: '0.75rem' }}>
          Are you sure you want to permanently delete the quiz{' '}
          <strong>"{quizToDelete?.title}"</strong>?
        </p>
        <p style={{ fontSize: '0.85rem', color: '#dc2626' }}>
          Warning: This action will permanently remove all associated questions and student attempt records for this quiz.
        </p>
      </Modal>
    </div>
  );
};

export default ManageQuizzes;
