import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import resultService from '../../services/resultService';
import QuestionCard from '../../components/QuestionCard';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        const data = await questionService.getQuestionsByQuizId(id);
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError(
          err.response?.data?.message || 'Failed to load quiz questions.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [id]);

  const handleSelectAnswer = (questionId, optionLetter) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      const res = await resultService.submitQuiz(id, selectedAnswers);
      navigate(`/result/${res.result._id}`, { replace: true });
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit quiz. Please try again.');
      setShowConfirmModal(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#64748b' }}>Preparing your quiz environment...</p>
      </div>
    );
  }

  if (error || !quiz || questions.length === 0) {
    return (
      <div className="content-container" style={{ maxWidth: '600px', padding: '3rem 1.5rem' }}>
        <div className="alert alert-error">{error || 'This quiz currently has no questions.'}</div>
        <Button variant="secondary" onClick={() => navigate('/quizzes')}>
          &larr; Back to Quizzes
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="content-container" style={{ maxWidth: '820px', paddingBottom: '4rem' }}>
      {/* Quiz Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#2563eb',
              textTransform: 'uppercase',
            }}
          >
            {quiz.category} &bull; {quiz.difficulty}
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
            {quiz.title}
          </h1>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Answered: <strong>{answeredCount}</strong> / {totalQuestions}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#e2e8f0',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '1.75rem',
        }}
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: '#2563eb',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* Question Palette / Quick Jump */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q._id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q._id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                fontSize: '0.825rem',
                fontWeight: 600,
                border: isCurrent
                  ? '2px solid #2563eb'
                  : isAnswered
                  ? '1px solid #93c5fd'
                  : '1px solid #e2e8f0',
                backgroundColor: isCurrent
                  ? '#eff6ff'
                  : isAnswered
                  ? '#dbeafe'
                  : '#ffffff',
                color: isCurrent ? '#2563eb' : isAnswered ? '#1d4ed8' : '#64748b',
                cursor: 'pointer',
              }}
              title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Not answered'}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Current Question */}
      <QuestionCard
        question={currentQuestion}
        index={currentIndex}
        totalQuestions={totalQuestions}
        selectedAnswer={selectedAnswers[currentQuestion._id]}
        onSelectAnswer={handleSelectAnswer}
      />

      {/* Navigation Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0 || submitting}
        >
          &larr; Previous
        </Button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {currentIndex < totalQuestions - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={submitting}
            >
              Next &rarr;
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmitClick}
              disabled={submitting}
              style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
            >
              Submit Quiz
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        title="Confirm Quiz Submission"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        confirmText="Confirm & Submit"
        confirmVariant="primary"
        isLoading={submitting}
      >
        <div>
          <p style={{ marginBottom: '1rem' }}>
            Are you sure you want to finish and submit your quiz answers?
          </p>

          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            <div>
              Total Questions: <strong>{totalQuestions}</strong>
            </div>
            <div>
              Questions Answered: <strong>{answeredCount}</strong>
            </div>
            {unansweredCount > 0 && (
              <div style={{ color: '#d97706', fontWeight: 600, marginTop: '0.25rem' }}>
                &bull; You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}!
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '1rem' }}>
            Once submitted, your responses will be scored immediately and you can review your answers.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Quiz;
