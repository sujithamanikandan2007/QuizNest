import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import resultService from '../../services/resultService';
import quizService from '../../services/quizService';

const ManageResults = () => {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedQuizId) params.quizId = selectedQuizId;
      if (studentSearch) params.studentName = studentSearch;
      if (dateFilter) params.date = dateFilter;

      const data = await resultService.getAllResultsAdmin(params);
      setResults(data);
    } catch (err) {
      console.error('Error fetching admin results:', err);
      setError('Failed to fetch quiz attempt results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilterQuizzes = async () => {
      try {
        const data = await quizService.getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      }
    };
    fetchFilterQuizzes();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [selectedQuizId, dateFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const handleResetFilters = () => {
    setSelectedQuizId('');
    setStudentSearch('');
    setDateFilter('');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quiz Results & Submissions</h1>
        <p className="page-subtitle">
          Examine submission logs across all registered students and filter by assessment parameters.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Filter Toolbar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {/* Quiz Filter */}
          <div style={{ flex: '1 1 200px' }}>
            <label
              htmlFor="filter-quiz"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}
            >
              Filter by Quiz
            </label>
            <select
              id="filter-quiz"
              className="form-control"
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
            >
              <option value="">All Quizzes</option>
              {quizzes.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title}
                </option>
              ))}
            </select>
          </div>

          {/* Student Filter */}
          <div style={{ flex: '1 1 220px' }}>
            <label
              htmlFor="filter-student"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}
            >
              Filter by Student Name/Email
            </label>
            <input
              id="filter-student"
              type="text"
              className="form-control"
              placeholder="e.g. Alex"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>

          {/* Date Filter */}
          <div style={{ flex: '1 1 160px' }}>
            <label
              htmlFor="filter-date"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}
            >
              Filter by Date
            </label>
            <input
              id="filter-date"
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              Filter
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading quiz results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No results match your criteria</h3>
          <p className="empty-state-desc">
            Try resetting your search query or picking another quiz.
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary">
            Reset Filters
          </button>
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
              {results.map((res) => (
                <tr key={res._id}>
                  <td>
                    <div>
                      <strong style={{ color: '#1e293b' }}>
                        {res.userId?.name || 'Student'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                      {res.userId?.email}
                    </div>
                  </td>
                  <td>
                    <div>{res.quizId?.title || 'Quiz'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {res.quizId?.category}
                    </div>
                  </td>
                  <td>
                    {res.score} / {res.totalQuestions}
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          res.percentage >= 70
                            ? '#16a34a'
                            : res.percentage >= 50
                            ? '#d97706'
                            : '#dc2626',
                      }}
                    >
                      {res.percentage}%
                    </span>
                  </td>
                  <td>{new Date(res.completedAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      to={`/review/${res._id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Review
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

export default ManageResults;
