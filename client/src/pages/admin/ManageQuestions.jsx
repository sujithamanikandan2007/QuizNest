import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import quizService from '../../services/quizService';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const ManageQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(quizId || '');
  const [quizDetails, setQuizDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete modal state
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all quizzes for the selector if quizId is not supplied in URL or to allow switching
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await quizService.getQuizzes();
        setQuizzes(data);
        if (!selectedQuizId && data.length > 0) {
          setSelectedQuizId(data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching quiz list:', err);
      }
    };
    loadQuizzes();
  }, []);

  // Update selectedQuizId when URL param changes
  useEffect(() => {
    if (quizId) {
      setSelectedQuizId(quizId);
    }
  }, [quizId]);

  // Load questions for the selected quiz
  const loadQuestions = async (idToLoad) => {
    if (!idToLoad) return;
    try {
      setLoading(true);
      setError('');
      const data = await questionService.getQuestionsByQuizId(idToLoad);
      setQuizDetails(data.quiz);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions for this quiz.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedQuizId) {
      loadQuestions(selectedQuizId);
    }
  }, [selectedQuizId]);

  const handleQuizChange = (e) => {
    const newId = e.target.value;
    setSelectedQuizId(newId);
    navigate(`/admin/quizzes/${newId}/questions`);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    try {
      setIsDeleting(true);
      await questionService.deleteQuestion(questionToDelete._id);
      setSuccess('Question deleted successfully.');
      setQuestionToDelete(null);
      await loadQuestions(selectedQuizId);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError(err.response?.data?.message || 'Failed to delete question.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top Header & Quiz Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="page-title">Question Management</h1>
          <p className="page-subtitle">
            Add, update, or remove assessment questions and configure options and correct keys.
          </p>
        </div>

        {/* Quiz Select Dropdown */}
        {quizzes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <label
              htmlFor="quiz-select"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}
            >
              Select Quiz:
            </label>
            <select
              id="quiz-select"
              className="form-control"
              value={selectedQuizId}
              onChange={handleQuizChange}
              style={{ minWidth: '220px' }}
            >
              {quizzes.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>
        )}
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

      {/* Selected Quiz Context Banner */}
      {quizDetails && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                {quizDetails.title}
              </h2>
              <span className="badge badge-neutral">{quizDetails.category}</span>
              <span className="badge badge-neutral">{quizDetails.difficulty}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Total Questions: <strong>{questions.length}</strong>
            </div>
          </div>

          <Link
            to={`/admin/quizzes/${selectedQuizId}/questions/new`}
            className="btn btn-primary"
          >
            + Add Question
          </Link>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No questions added yet</h3>
          <p className="empty-state-desc">
            This quiz currently contains no questions. Click below to add the first question.
          </p>
          <Link
            to={`/admin/quizzes/${selectedQuizId}/questions/new`}
            className="btn btn-primary"
          >
            + Add Question
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>No.</th>
                <th>Question</th>
                <th>Option A</th>
                <th>Option B</th>
                <th>Option C</th>
                <th>Option D</th>
                <th style={{ width: '110px' }}>Correct Answer</th>
                <th style={{ textAlign: 'right', width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => (
                <tr key={q._id}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b', maxWidth: '280px' }}>
                      {q.question}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{q.options[0]}</td>
                  <td style={{ fontSize: '0.85rem' }}>{q.options[1]}</td>
                  <td style={{ fontSize: '0.85rem' }}>{q.options[2]}</td>
                  <td style={{ fontSize: '0.85rem' }}>{q.options[3]}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#f0fdf4',
                        color: '#16a34a',
                        border: '1px solid #bbf7d0',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'inline-block',
                      }}
                    >
                      Option {q.correctAnswer}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <Link
                        to={`/admin/quizzes/${selectedQuizId}/questions/${q._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setQuestionToDelete(q)}
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

      {/* Delete Question Confirmation Modal */}
      <Modal
        isOpen={!!questionToDelete}
        title="Delete Question"
        onClose={() => setQuestionToDelete(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger-solid"
        isLoading={isDeleting}
      >
        <p style={{ marginBottom: '0.75rem' }}>
          Are you sure you want to delete this question?
        </p>
        <div
          style={{
            padding: '0.75rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#1e293b',
            fontStyle: 'italic',
          }}
        >
          "{questionToDelete?.question}"
        </div>
      </Modal>
    </div>
  );
};

export default ManageQuestions;
