import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resultService from '../../services/resultService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalStudents: 0,
    totalAttempts: 0,
    recentAttempts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const data = await resultService.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
        setError('Failed to load admin statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div>
        <p style={{ color: '#64748b' }}>Loading administrative dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">
          Overview of platform activity, assessment catalogue, and student metrics.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* 4 Simple Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Quizzes</div>
          <div className="stat-value">{stats.totalQuizzes}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Questions</div>
          <div className="stat-value">{stats.totalQuestions}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Attempts</div>
          <div className="stat-value">{stats.totalAttempts}</div>
        </div>
      </div>

      {/* Recent Attempts Table */}
      <div style={{ marginTop: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b' }}>
            Recent Quiz Attempts
          </h2>
          <Link
            to="/admin/results"
            style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: 500 }}
          >
            View all results &rarr;
          </Link>
        </div>

        {stats.recentAttempts?.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-desc">No student quiz attempts recorded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttempts.map((attempt) => (
                  <tr key={attempt._id}>
                    <td>
                      <div>
                        <strong>{attempt.userId?.name || 'Student'}</strong>
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                        {attempt.userId?.email}
                      </div>
                    </td>
                    <td>{attempt.quizId?.title || 'Quiz'}</td>
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
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/result/${attempt._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
