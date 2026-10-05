import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resultService from '../../services/resultService';

const MyAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const data = await resultService.getMyResults();
        setAttempts(data);
      } catch (err) {
        console.error('Error fetching student attempts:', err);
        setError('Failed to fetch your quiz attempts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">My Quiz Attempts</h1>
        <p className="page-subtitle">
          Review your previous submissions, scores, and performance history.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading your attempts...</p>
        </div>
      ) : attempts.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No attempts recorded yet</h3>
          <p className="empty-state-desc">
            You haven't attempted any quizzes yet. Explore our quiz catalogue to get started!
          </p>
          <Link to="/quizzes" className="btn btn-primary">
            Explore Quizzes
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Category</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt._id}>
                  <td>
                    <strong style={{ color: '#1e293b' }}>
                      {attempt.quizId?.title || 'Quiz'}
                    </strong>
                  </td>
                  <td>{attempt.quizId?.category || 'General'}</td>
                  <td>
                    {attempt.score} / {attempt.totalQuestions}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          attempt.percentage >= 70
                            ? '#16a34a'
                            : attempt.percentage >= 50
                            ? '#d97706'
                            : '#dc2626',
                      }}
                    >
                      {attempt.percentage}%
                    </span>
                  </td>
                  <td>
                    {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/result/${attempt._id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Result
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAttempts;
