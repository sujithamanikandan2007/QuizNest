import React, { useEffect, useState } from 'react';
import resultService from '../../services/resultService';
import Modal from '../../components/Modal';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected student for details modal
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await resultService.getAllStudentsAdmin();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to fetch students list.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleViewDetails = async (studentId) => {
    try {
      setSelectedStudentId(studentId);
      setDetailsLoading(true);
      const data = await resultService.getStudentByIdAdmin(studentId);
      setStudentDetails(data);
    } catch (err) {
      console.error('Error fetching student details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Registered Students</h1>
        <p className="page-subtitle">
          View registered student roster, account registration dates, and participation counts.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '360px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Filter students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#64748b' }}>Loading students list...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No students found</h3>
          <p className="empty-state-desc">
            No students match your search criteria.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Quizzes Attempted</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <strong style={{ color: '#1e293b' }}>{student.name}</strong>
                  </td>
                  <td>{student.email}</td>
                  <td>
                    {new Date(student.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}
                    >
                      {student.quizzesAttempted}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleViewDetails(student._id)}
                      className="btn btn-secondary btn-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Details Modal */}
      <Modal
        isOpen={!!selectedStudentId}
        title="Student Profile & Performance"
        onClose={() => {
          setSelectedStudentId(null);
          setStudentDetails(null);
        }}
        confirmText="Close"
        onConfirm={() => {
          setSelectedStudentId(null);
          setStudentDetails(null);
        }}
      >
        {detailsLoading || !studentDetails ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>
            Loading student history...
          </p>
        ) : (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1.25rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Full Name</div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                  {studentDetails.student.name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email</div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>
                  {studentDetails.student.email}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Joined Date</div>
                <div style={{ color: '#334155' }}>
                  {new Date(studentDetails.student.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Average Score</div>
                <div style={{ fontWeight: 600, color: '#16a34a' }}>
                  {studentDetails.stats.averageScore}%
                </div>
              </div>
            </div>

            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem', color: '#1e293b' }}>
              Attempt History ({studentDetails.attempts?.length || 0})
            </div>

            {studentDetails.attempts?.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                This student has not attempted any quizzes yet.
              </p>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table className="data-table" style={{ fontSize: '0.825rem' }}>
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentDetails.attempts.map((att) => (
                      <tr key={att._id}>
                        <td>{att.quizId?.title || 'Quiz'}</td>
                        <td>
                          {att.score}/{att.totalQuestions}
                        </td>
                        <td style={{ fontWeight: 600 }}>{att.percentage}%</td>
                        <td>{new Date(att.completedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageStudents;
