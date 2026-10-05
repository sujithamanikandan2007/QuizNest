import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import QuizCard from '../../components/QuizCard';

const Home = () => {
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizService.getQuizzes();
        setFeaturedQuizzes(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching landing quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const categories = [
    { name: 'Programming', count: 'Java & Object Oriented Design', tag: 'Core' },
    { name: 'Web Development', count: 'JavaScript & Modern ES6+', tag: 'Frontend' },
    { name: 'Frontend Frameworks', count: 'React.js & State Management', tag: 'UI' },
    { name: 'Databases', count: 'DBMS, SQL & Normalization', tag: 'Backend' },
    { name: 'Networking', count: 'OSI Model, TCP/IP & Protocols', tag: 'Systems' },
  ];

  const steps = [
    {
      step: '1',
      title: 'Choose a Quiz',
      desc: 'Select from curated computer science and programming topics tailored for college students and developers.',
    },
    {
      step: '2',
      title: 'Answer Questions',
      desc: 'Work through multiple-choice questions with a clean, focused interface and intuitive navigation.',
    },
    {
      step: '3',
      title: 'View Your Result',
      desc: 'Get instant score calculation, percentage evaluation, and detailed question-by-question answer reviews.',
    },
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '4.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid #bfdbfe',
            }}
          >
            Academic Assessment Platform
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#1e293b',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Test your knowledge. Track your progress.
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              color: '#64748b',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto 2rem',
            }}
          >
            Practice your skills with quizzes across programming, databases and computer science.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to="/quizzes"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              Explore Quizzes
            </Link>
            <Link
              to="/register"
              style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="content-container" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.625rem',
              fontWeight: 700,
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}
          >
            How It Works
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            A streamlined three-step assessment workflow
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {steps.map((item) => (
            <div
              key={item.step}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {item.step}
              </div>
              <h3
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.5rem',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="content-container" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              Popular Categories
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Subject areas available for online evaluation
            </p>
          </div>
          <Link
            to="/quizzes"
            style={{
              color: '#2563eb',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            View all quizzes &rarr;
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to="/quizzes"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.25rem',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  marginBottom: '0.4rem',
                }}
              >
                {cat.tag}
              </div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem', marginBottom: '0.25rem' }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{cat.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Quizzes Sample */}
      {!loading && featuredQuizzes.length > 0 && (
        <section className="content-container" style={{ paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              Featured Quizzes
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Jump straight into a quiz to evaluate your understanding
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
