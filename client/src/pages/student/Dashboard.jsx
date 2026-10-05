import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import resultService from '../../services/resultService';
import quizService from '../../services/quizService';
import QuizCard from '../../components/QuizCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profileRes, quizzesRes] = await Promise.all([
          resultService.getStudentProfile(),
          quizService.getQuizzes(),
        ]);
        setProfileData(profileRes);
        setAvailableQuizzes(quizzesRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Unable to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#64748b' }}>Loading student dashboard...</p>
      </div>
    );
  }

  const stats = profileData?.stats || {
    quizzesAttempted: 0,
    averageScore: 0,
    highestScore: 0,
  };

  const recentAttempts = profileData?.recentAttempts || [];

  return (
    <div className="content-container">
      {/* Welcome Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title">Welcome, {user?.name || 'Student'}</h1>
        <p className="page-subtitle">Track your performance and attempt new practice assessments.</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Small Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Quizzes Attempted</div>
          <div className="stat-value">{stats.quizzesAttempted}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">{stats.averageScore}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Highest Score</div>
          <div className="stat-value">{stats.highestScore}%</div>
        </div>
      </div>

      {/* Recently Attempted Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
            Recently Attempted
          </h2>
          {recentAttempts.length > 0 && (
            <Link
              to="/my-attempts"
              style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}
            >
              View all attempts &rarr;
            </Link>
          )}
        </div>

        {recentAttempts.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">No quiz attempts yet</h3>
            <p className="empty-state-desc">
              You haven't attempted any quizzes so far. Select one of the available quizzes below to start!
            </p>
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
                {recentAttempts.map((attempt) => (
                  <tr key={attempt._id}>
                    <td>
                      <strong>{attempt.quizId?.title || 'Quiz'}</strong>
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
                    <td>{new Date(attempt.completedAt).toLocaleDateString()}</td>
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
      </section>

      {/* Available Quizzes */}
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
            Available Quizzes
          </h2>
          <Link
            to="/quizzes"
            style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}
          >
            Browse all quizzes &rarr;
          </Link>
        </div>

        {availableQuizzes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-desc">No quizzes are currently published.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {availableQuizzes.slice(0, 4).map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
