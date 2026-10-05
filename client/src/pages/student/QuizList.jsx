import React, { useEffect, useState } from 'react';
import quizService from '../../services/quizService';
import QuizCard from '../../components/QuizCard';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quiz list:', err);
        setError('Failed to load quizzes. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const categories = ['All', ...new Set(quizzes.map((q) => q.category).filter(Boolean))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || quiz.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === 'All' || quiz.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Explore Quizzes</h1>
        <p className="page-subtitle">
          Choose a subject to test your understanding and practice technical concepts.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 260px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by quiz title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-control"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading available quizzes...</p>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No quizzes found</h3>
          <p className="empty-state-desc">
            Try adjusting your search criteria or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
