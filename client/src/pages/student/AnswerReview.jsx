import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import resultService from '../../services/resultService';
import Button from '../../components/Button';

const AnswerReview = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const data = await resultService.getResultById(id);
        setResult(data);
      } catch (err) {
        console.error('Error fetching answer review:', err);
        setError('Failed to load answer review.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#64748b' }}>Loading answer review...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="content-container" style={{ maxWidth: '500px', padding: '3rem 1rem' }}>
        <div className="alert alert-error">{error || 'Review details not found.'}</div>
        <Link to="/my-attempts" className="btn btn-secondary">
          &larr; Back to My Attempts
        </Link>
      </div>
    );
  }

  const { quizId, score, totalQuestions, percentage, answers } = result;
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="content-container" style={{ maxWidth: '820px', paddingBottom: '4rem' }}>
      {/* Header and Summary Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>
            Answer Review
          </div>
          <h1 className="page-title">{quizId?.title || 'Quiz Review'}</h1>
          <p className="page-subtitle">
            Score: <strong>{score} / {totalQuestions}</strong> ({percentage}%)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/result/${result._id}`} className="btn btn-secondary btn-sm">
            &larr; Back to Summary
          </Link>
          <Link to="/quizzes" className="btn btn-primary btn-sm">
            All Quizzes
          </Link>
        </div>
      </div>

      {/* Questions Review List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {answers.map((ans, idx) => {
          const isCorrect = ans.isCorrect;
          const options = ans.options || [];

          // Find option text for letter
          const correctLetterIdx = letters.indexOf(ans.correctAnswer);
          const selectedLetterIdx = letters.indexOf(ans.selectedAnswer);

          const correctText = correctLetterIdx >= 0 ? options[correctLetterIdx] : '';
          const selectedText = selectedLetterIdx >= 0 ? options[selectedLetterIdx] : '';

          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                border: isCorrect ? '1px solid #bbf7d0' : '1px solid #fecaca',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                  }}
                >
                  Question {idx + 1}
                </span>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    backgroundColor: isCorrect ? '#f0fdf4' : '#fef2f2',
                    color: isCorrect ? '#16a34a' : '#dc2626',
                    border: isCorrect ? '1px solid #bbf7d0' : '1px solid #fecaca',
                  }}
                >
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: 1.45,
                  marginBottom: '1.25rem',
                }}
              >
                {ans.questionText}
              </h3>

              {/* Options Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {options.map((opt, optIdx) => {
                  const letter = letters[optIdx];
                  const isThisCorrect = ans.correctAnswer === letter;
                  const isThisSelected = ans.selectedAnswer === letter;

                  let itemBg = '#f8fafc';
                  let itemBorder = '#e2e8f0';
                  let itemColor = '#334155';

                  if (isThisCorrect) {
                    itemBg = '#f0fdf4';
                    itemBorder = '#bbf7d0';
                    itemColor = '#166534';
                  } else if (isThisSelected && !isThisCorrect) {
                    itemBg = '#fef2f2';
                    itemBorder = '#fecaca';
                    itemColor = '#991b1b';
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: '0.65rem 0.9rem',
                        borderRadius: '6px',
                        backgroundColor: itemBg,
                        border: `1px solid ${itemBorder}`,
                        fontSize: '0.9rem',
                        color: itemColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 600 }}>{letter}.</span>
                        <span>{opt}</span>
                      </div>

                      <div style={{ fontSize: '0.775rem', fontWeight: 600 }}>
                        {isThisSelected && isThisCorrect && (
                          <span style={{ color: '#16a34a' }}>Your Answer (Correct)</span>
                        )}
                        {isThisSelected && !isThisCorrect && (
                          <span style={{ color: '#dc2626' }}>Your Answer (Incorrect)</span>
                        )}
                        {!isThisSelected && isThisCorrect && (
                          <span style={{ color: '#16a34a' }}>Correct Answer</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary of Selected vs Correct */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.875rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <span style={{ color: '#64748b' }}>Selected Answer: </span>
                  <strong style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                    {ans.selectedAnswer || 'Not Answered'} {selectedText ? `(${selectedText})` : ''}
                  </strong>
                </div>

                {!isCorrect && (
                  <div>
                    <span style={{ color: '#64748b' }}>Correct Answer: </span>
                    <strong style={{ color: '#16a34a' }}>
                      {ans.correctAnswer} {correctText ? `(${correctText})` : ''}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerReview;
