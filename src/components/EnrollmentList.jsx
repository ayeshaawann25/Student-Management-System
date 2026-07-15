import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EnrollmentList = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEnrollment, setNewEnrollment] = useState({
    student: '',
    course: '',
    semester: '',
    academicYear: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        axios.get('/api/enrollments'),
        axios.get('/api/students'),
        axios.get('/api/courses')
      ]);
      setEnrollments(enrollmentsRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/enrollments', newEnrollment);
      setShowForm(false);
      setNewEnrollment({ student: '', course: '', semester: '', academicYear: '' });
      fetchData();
    } catch (error) {
      alert('Error enrolling student: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteEnrollment = async (id) => {
    if (window.confirm('Are you sure you want to remove this enrollment?')) {
      try {
        await axios.delete(`/api/enrollments/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
      }
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="card-header">Enrollments</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> New Enrollment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleEnroll} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
            <select
              className="form-control"
              value={newEnrollment.student}
              onChange={e => setNewEnrollment({...newEnrollment, student: e.target.value})}
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.studentId})</option>
              ))}
            </select>
            <select
              className="form-control"
              value={newEnrollment.course}
              onChange={e => setNewEnrollment({...newEnrollment, course: e.target.value})}
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Semester"
              value={newEnrollment.semester}
              onChange={e => setNewEnrollment({...newEnrollment, semester: e.target.value})}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Academic Year"
              value={newEnrollment.academicYear}
              onChange={e => setNewEnrollment({...newEnrollment, academicYear: e.target.value})}
              required
            />
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">Enroll</button>
            <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Academic Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment._id}>
                <td>{enrollment.student?.firstName} {enrollment.student?.lastName}</td>
                <td>{enrollment.course?.courseName}</td>
                <td>{enrollment.semester}</td>
                <td>{enrollment.academicYear}</td>
                <td>
                  <span className={`badge badge-${
                    enrollment.status === 'Enrolled' ? 'success' : 
                    enrollment.status === 'Completed' ? 'info' : 
                    enrollment.status === 'Dropped' ? 'danger' : 'warning'
                  }`}>
                    {enrollment.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteEnrollment(enrollment._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentList;
