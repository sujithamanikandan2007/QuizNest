import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import quizService from '../../services/quizService';
import Button from '../../components/Button';

const EditQuestion = () => {
  const { quizId, questionId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [quizRes, questionsRes] = await Promise.all([
          quizService.getQuizById(quizId),
          questionService.getQuestionsByQuizId(quizId),
        ]);

        setQuiz(quizRes);
        const questionToEdit = questionsRes.questions?.find(
          (q) => q._id === questionId
        );

        if (questionToEdit) {
          setFormData({
            question: questionToEdit.question || '',
            optionA: questionToEdit.options[0] || '',
            optionB: questionToEdit.options[1] || '',
            optionC: questionToEdit.options[2] || '',
            optionD: questionToEdit.options[3] || '',
            correctAnswer: questionToEdit.correctAnswer || 'A',
          });
        } else {
          setError('Question not found in this quiz.');
        }
      } catch (err) {
        console.error('Error fetching question to edit:', err);
        setError('Failed to load question details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, questionId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCorrectAnswerChange = (letter) => {
    setFormData({
      ...formData,
      correctAnswer: letter,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { question, optionA, optionB, optionC, optionD, correctAnswer } = formData;

    if (!question || !question.trim()) {
      setError('Question text cannot be empty.');
      return;
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setError('All four options (Option A, B, C, D) are required.');
      return;
    }

    try {
      setSaving(true);
      await questionService.updateQuestion(questionId, {
        question: question.trim(),
        options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
        correctAnswer,
      });

      navigate(`/admin/quizzes/${quizId}/questions`);
    } catch (err) {
      console.error('Error updating question:', err);
      setError(err.response?.data?.message || 'Failed to update question.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <p style={{ color: '#64748b' }}>Loading question details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <div className="page-header">
        <h1 className="page-title">Edit Question</h1>
        <p className="page-subtitle">
          Editing question in: <strong>{quiz?.title || 'Quiz'}</strong>
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
          {/* Question text */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="edit-question-input">
              Question Text *
            </label>
            <textarea
              id="edit-question-input"
              name="question"
              className="form-control"
              rows={3}
              value={formData.question}
              onChange={handleChange}
              required
            />
          </div>

          {/* Options A, B, C, D */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', marginBottom: '1rem' }}>
              Options (All 4 Required)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="edit-option-a">
                  Option A *
                </label>
                <input
                  id="edit-option-a"
                  name="optionA"
                  type="text"
                  className="form-control"
                  value={formData.optionA}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="edit-option-b">
                  Option B *
                </label>
                <input
                  id="edit-option-b"
                  name="optionB"
                  type="text"
                  className="form-control"
                  value={formData.optionB}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="edit-option-c">
                  Option C *
                </label>
                <input
                  id="edit-option-c"
                  name="optionC"
                  type="text"
                  className="form-control"
                  value={formData.optionC}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="edit-option-d">
                  Option D *
                </label>
                <input
                  id="edit-option-d"
                  name="optionD"
                  type="text"
                  className="form-control"
                  value={formData.optionD}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Correct Answer Radio Buttons */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '2rem',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.75rem' }}>
              Correct Answer *
            </div>
            <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
              {['A', 'B', 'C', 'D'].map((letter) => (
                <label
                  key={letter}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: formData.correctAnswer === letter ? '#2563eb' : '#475569',
                  }}
                >
                  <input
                    type="radio"
                    name="editCorrectAnswer"
                    value={letter}
                    checked={formData.correctAnswer === letter}
                    onChange={() => handleCorrectAnswerChange(letter)}
                    style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                  />
                  Option {letter}
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuestion;
