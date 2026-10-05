import React, { useEffect, useState } from 'react';
import resultService from '../../services/resultService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await resultService.getStudentProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="content-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: '#64748b' }}>Loading student profile...</p>
      </div>
    );
  }

  const currentUser = profileData?.user || user;
  const stats = profileData?.stats || {
    quizzesAttempted: 0,
    averageScore: 0,
    highestScore: 0,
  };

  return (
    <div className="content-container" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      <div className="page-header">
        <h1 className="page-title">Student Profile</h1>
        <p className="page-subtitle">Your student credentials and performance overview.</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Profile Information Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          Account Details
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Full Name
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              {currentUser?.name || 'Student'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Email Address
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              {currentUser?.email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Account Role
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>
              <span className="badge badge-neutral">{currentUser?.role || 'student'}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Account Created Date
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              {currentUser?.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
          Performance Summary
        </h2>

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
      </div>
    </div>
  );
};

export default Profile;
