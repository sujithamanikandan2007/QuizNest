import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Quizzes', path: '/admin/quizzes' },
    { label: 'Questions', path: '/admin/questions' },
    { label: 'Students', path: '/admin/students' },
    { label: 'Results', path: '/admin/results' },
  ];

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
          }}
        >
          Q
        </div>
        <div>
          <div
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.02em',
            }}
          >
            QuizNest
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Administration</div>
        </div>
      </div>

      {/* Admin Navigation */}
      <nav
        style={{
          padding: '1.25rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          flex: 1,
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              padding: '0.6rem 0.9rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#2563eb' : '#475569',
              backgroundColor: isActive ? '#eff6ff' : 'transparent',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User info & Logout */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      >
        <div style={{ fontSize: '0.825rem', color: '#1e293b', fontWeight: 600, marginBottom: '0.15rem' }}>
          {user?.name || 'Administrator'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
          {user?.email}
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'center',
            padding: '0.45rem',
            fontSize: '0.825rem',
            color: '#dc2626',
            backgroundColor: '#ffffff',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
