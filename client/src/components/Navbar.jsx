import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            Q
          </div>
          <div>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1e293b',
                letterSpacing: '-0.02em',
              }}
            >
              QuizNest
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#2563eb' : '#475569',
            })}
          >
            Home
          </NavLink>

          <NavLink
            to="/quizzes"
            style={({ isActive }) => ({
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#2563eb' : '#475569',
            })}
          >
            Quizzes
          </NavLink>

          {user ? (
            <>
              {isAdmin ? (
                <NavLink
                  to="/admin/dashboard"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  Admin Panel
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/dashboard"
                    style={({ isActive }) => ({
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#2563eb' : '#475569',
                    })}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/my-attempts"
                    style={({ isActive }) => ({
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#2563eb' : '#475569',
                    })}
                  >
                    My Attempts
                  </NavLink>
                  <NavLink
                    to="/profile"
                    style={({ isActive }) => ({
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#2563eb' : '#475569',
                    })}
                  >
                    Profile
                  </NavLink>
                </>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginLeft: '0.5rem',
                  paddingLeft: '1rem',
                  borderLeft: '1px solid #e2e8f0',
                }}
              >
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    fontWeight: 600,
                  }}
                >
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    fontSize: '0.85rem',
                    color: '#dc2626',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#1e293b',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '6px',
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  backgroundColor: '#2563eb',
                  padding: '0.45rem 1rem',
                  borderRadius: '6px',
                }}
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-nav-toggle"
          style={{
            padding: '0.4rem',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            color: '#1e293b',
          }}
          aria-label="Toggle navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
          className="mobile-nav-menu"
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/quizzes" onClick={() => setMobileMenuOpen(false)}>
            Quizzes
          </Link>
          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/my-attempts" onClick={() => setMobileMenuOpen(false)}>
                    My Attempts
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                </>
              )}
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  Signed in as <strong>{user.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    color: '#dc2626',
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    fontWeight: 500,
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '4px',
                  textAlign: 'center',
                  flex: 1,
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
