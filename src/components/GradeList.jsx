import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeList = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGrade, setNewGrade] = useState({
    student: '',
    course: '',
    semester: '',
    academicYear: '',
    assignment1: { score: 0, maxScore: 100, weight: 10 },
    assignment2: { score: 0, maxScore: 100, weight: 10 },
    midterm: { score: 0, maxScore: 100, weight: 30 },
    finalExam: { score: 0, maxScore: 100, weight: 50 }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradesRes, studentsRes, coursesRes] = await Promise.all([
        axios.get('/api/grades'),
        axios.get('/api/students'),
        axios.get('/api/courses')
      ]);
      setGrades(gradesRes.data);
      setStudents(studentsRes.data);
      setCourses(coursesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/grades', newGrade);
      setShowForm(false);
      setNewGrade({
        student: '',
        course: '',
        semester: '',
        academicYear: '',
        assignment1: { score: 0, maxScore: 100, weight: 10 },
        assignment2: { score: 0, maxScore: 100, weight: 10 },
        midterm: { score: 0, maxScore: 100, weight: 30 },
        finalExam: { score: 0, maxScore: 100, weight: 50 }
      });
      fetchData();
    } catch (error) {
      alert('Error saving grade: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="card-header">Grade Management</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          Add Grade
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select
              className="form-control"
              value={newGrade.student}
              onChange={e => setNewGrade({...newGrade, student: e.target.value})}
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            <select
              className="form-control"
              value={newGrade.course}
              onChange={e => setNewGrade({...newGrade, course: e.target.value})}
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.courseName}</option>
              ))}
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Semester"
              value={newGrade.semester}
              onChange={e => setNewGrade({...newGrade, semester: e.target.value})}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Academic Year"
              value={newGrade.academicYear}
              onChange={e => setNewGrade({...newGrade, academicYear: e.target.value})}
              required
            />
          </div>
          
          <h4 style={{ margin: '15px 0 10px' }}>Scores</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
            {['assignment1', 'assignment2', 'midterm', 'finalExam'].map((field) => (
              <div key={field}>
                <label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                <input
                  type="number"
                  className="form-control"
                  value={newGrade[field].score}
                  onChange={e => setNewGrade({
                    ...newGrade,
                    [field]: { ...newGrade[field], score: Number(e.target.value) }
                  })}
                  min="0"
                  max="100"
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">Save Grade</button>
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
              <th>Total Score</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(grade => (
              <tr key={grade._id}>
                <td>{grade.student?.firstName} {grade.student?.lastName}</td>
                <td>{grade.course?.courseName}</td>
                <td>{grade.semester}</td>
                <td>{grade.totalScore}/400</td>
                <td>
                  <span className={`badge badge-${
                    grade.grade?.startsWith('A') ? 'success' :
                    grade.grade?.startsWith('B') ? 'info' :
                    grade.grade?.startsWith('C') ? 'warning' : 'danger'
                  }`}>
                    {grade.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeList;
