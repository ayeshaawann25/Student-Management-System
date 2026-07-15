import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    student: '',
    course: '',
    date: '',
    status: 'Present',
    semester: '',
    checkInTime: '',
    remarks: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [attendanceRes, studentsRes, coursesRes] = await Promise.all([
        axios.get('/api/attendance'),
        axios.get('/api/students'),
        axios.get('/api/courses')
      ]);
      setAttendance(attendanceRes.data);
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
      await axios.post('/api/attendance', newAttendance);
      setShowForm(false);
      setNewAttendance({
        student: '',
        course: '',
        date: '',
        status: 'Present',
        semester: '',
        checkInTime: '',
        remarks: ''
      });
      fetchData();
    } catch (error) {
      alert('Error marking attendance: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="card-header">Attendance Records</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> Mark Attendance
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <select
              className="form-control"
              value={newAttendance.student}
              onChange={e => setNewAttendance({...newAttendance, student: e.target.value})}
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            <select
              className="form-control"
              value={newAttendance.course}
              onChange={e => setNewAttendance({...newAttendance, course: e.target.value})}
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.courseName}</option>
              ))}
            </select>
            <input
              type="date"
              className="form-control"
              value={newAttendance.date}
              onChange={e => setNewAttendance({...newAttendance, date: e.target.value})}
              required
            />
            <select
              className="form-control"
              value={newAttendance.status}
              onChange={e => setNewAttendance({...newAttendance, status: e.target.value})}
              required
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Excused">Excused</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Semester"
              value={newAttendance.semester}
              onChange={e => setNewAttendance({...newAttendance, semester: e.target.value})}
              required
            />
            <input
              type="time"
              className="form-control"
              value={newAttendance.checkInTime}
              onChange={e => setNewAttendance({...newAttendance, checkInTime: e.target.value})}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Remarks"
              value={newAttendance.remarks}
              onChange={e => setNewAttendance({...newAttendance, remarks: e.target.value})}
            />
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">Save Attendance</button>
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
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td>{record.student?.firstName} {record.student?.lastName}</td>
                <td>{record.course?.courseName}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${
                    record.status === 'Present' ? 'success' :
                    record.status === 'Absent' ? 'danger' :
                    record.status === 'Late' ? 'warning' : 'info'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.checkInTime || 'N/A'}</td>
                <td>{record.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
