import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import resultService from '../../services/resultService';
import Button from '../../components/Button';

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
        console.error('Error fetching quiz result:', err);
        setError('Failed to load quiz results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#64748b' }}>Calculating your results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="content-container" style={{ maxWidth: '500px', padding: '3rem 1rem' }}>
        <div className="alert alert-error">{error || 'Result not found.'}</div>
        <Button variant="secondary" onClick={() => navigate('/quizzes')}>
          &larr; Back to Quizzes
        </Button>
      </div>
    );
  }

  const { score, totalQuestions, percentage, quizId, completedAt } = result;
  const wrongAnswers = totalQuestions - score;
  const isPassed = percentage >= 60;

  return (
    <div className="content-container" style={{ maxWidth: '680px', paddingBottom: '4rem' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '2.5rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: isPassed ? '#f0fdf4' : '#fef2f2',
            color: isPassed ? '#16a34a' : '#dc2626',
            border: isPassed ? '1px solid #bbf7d0' : '1px solid #fecaca',
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
        >
          {isPassed ? '✓' : '!'}
        </div>

        <h1
          style={{
            fontSize: '1.625rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '0.35rem',
          }}
        >
          Quiz Completed
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          {quizId?.title || 'Practice Quiz'} &bull; Completed on{' '}
          {new Date(completedAt).toLocaleDateString()}
        </p>

        {/* Big Score Box */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Final Score
          </div>
          <div
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              color: isPassed ? '#16a34a' : '#dc2626',
              lineHeight: 1.2,
              margin: '0.25rem 0',
            }}
          >
            {score} <span style={{ fontSize: '1.5rem', color: '#64748b', fontWeight: 500 }}>/ {totalQuestions}</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
            {percentage}% Overall Accuracy
          </div>
        </div>

        {/* Small Summary Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '1rem 0.5rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
              Correct Answers
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#16a34a' }}>
              {score}
            </div>
          </div>

          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '1rem 0.5rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
              Wrong Answers
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#dc2626' }}>
              {wrongAnswers}
            </div>
          </div>

          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '1rem 0.5rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
              Percentage
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.85rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to={`/quiz/${quizId?._id || quizId}`}
            className="btn btn-secondary"
          >
            Try Again
          </Link>
          <Link
            to={`/review/${result._id}`}
            className="btn btn-primary"
          >
            View Answers
          </Link>
          <Link
            to="/quizzes"
            className="btn btn-secondary"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
