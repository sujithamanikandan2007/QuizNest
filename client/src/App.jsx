import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// Student / Public Pages
import Home from './pages/student/Home';
import Dashboard from './pages/student/Dashboard';
import QuizList from './pages/student/QuizList';
import Quiz from './pages/student/Quiz';
import Result from './pages/student/Result';
import AnswerReview from './pages/student/AnswerReview';
import MyAttempts from './pages/student/MyAttempts';
import Profile from './pages/student/Profile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import AddQuiz from './pages/admin/AddQuiz';
import EditQuiz from './pages/admin/EditQuiz';
import ManageQuestions from './pages/admin/ManageQuestions';
import AddQuestion from './pages/admin/AddQuestion';
import EditQuestion from './pages/admin/EditQuestion';
import ManageStudents from './pages/admin/ManageStudents';
import ManageResults from './pages/admin/ManageResults';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminRoute && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quizzes" element={<QuizList />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result/:id"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review/:id"
            element={
              <ProtectedRoute>
                <AnswerReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-attempts"
            element={
              <ProtectedRoute>
                <MyAttempts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="quizzes" element={<ManageQuizzes />} />
            <Route path="quizzes/new" element={<AddQuiz />} />
            <Route path="quizzes/:id/edit" element={<EditQuiz />} />
            <Route path="quizzes/:quizId/questions" element={<ManageQuestions />} />
            <Route path="quizzes/:quizId/questions/new" element={<AddQuestion />} />
            <Route path="quizzes/:quizId/questions/:questionId/edit" element={<EditQuestion />} />
            <Route path="questions" element={<ManageQuestions />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="results" element={<ManageResults />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <footer
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1.75rem 1.5rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
              QuizNest
            </div>
            <div>Test your knowledge. Track your progress. &copy; {new Date().getFullYear()}</div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
