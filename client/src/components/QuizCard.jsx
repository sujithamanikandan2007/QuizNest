import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const getBadgeClass = (difficulty) => {
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
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.75rem',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.775rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: '#2563eb',
              letterSpacing: '0.04em',
            }}
          >
            {quiz.category}
          </span>
          <span className={`badge ${getBadgeClass(quiz.difficulty)}`}>
            {quiz.difficulty}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
          }}
        >
          {quiz.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            minHeight: '2.6rem',
          }}
        >
          {quiz.description}
        </p>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid #f1f5f9',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <span>
            <strong>{quiz.questionCount ?? quiz.questions?.length ?? 0}</strong> Questions
          </span>
          <span>Multiple Choice</span>
        </div>

        <Link
          to={`/quiz/${quiz._id}`}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0.6rem 1rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
