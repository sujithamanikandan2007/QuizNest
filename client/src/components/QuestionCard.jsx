import React from 'react';

const QuestionCard = ({
  question,
  index,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}) => {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Question {index + 1} of {totalQuestions}
        </span>
      </div>

      <h2
        style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#1e293b',
          lineHeight: 1.5,
          marginBottom: '1.75rem',
        }}
      >
        {question.question}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {question.options.map((option, optIdx) => {
          const letter = letters[optIdx];
          const isSelected = selectedAnswer === letter;

          return (
            <label
              key={optIdx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.9rem 1.15rem',
                borderRadius: '8px',
                border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="radio"
                name={`question-${question._id}`}
                value={letter}
                checked={isSelected}
                onChange={() => onSelectAnswer(question._id, letter)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#2563eb',
                  cursor: 'pointer',
                }}
              />
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: isSelected ? '#2563eb' : '#64748b',
                  minWidth: '20px',
                }}
              >
                {letter}.
              </span>
              <span
                style={{
                  fontSize: '0.95rem',
                  color: isSelected ? '#1e293b' : '#334155',
                  lineHeight: 1.4,
                }}
              >
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
