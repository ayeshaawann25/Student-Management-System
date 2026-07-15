import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingFees: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [students, courses, enrollments, fees] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/courses'),
        axios.get('/api/enrollments'),
        axios.get('/api/fees')
      ]);

      const pendingFees = fees.data.filter(f => f.status === 'Pending' || f.status === 'Overdue');
      const totalPending = pendingFees.reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0);

      setStats({
        totalStudents: students.data.length,
        totalCourses: courses.data.length,
        totalEnrollments: enrollments.data.length,
        pendingFees: totalPending,
        attendanceRate: 92 // You can calculate this from attendance data
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="number">{stats.totalStudents}</div>
          <div className="label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.totalCourses}</div>
          <div className="label">Total Courses</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.totalEnrollments}</div>
          <div className="label">Enrollments</div>
        </div>
        <div className="stat-card">
          <div className="number">${stats.pendingFees.toFixed(2)}</div>
          <div className="label">Pending Fees</div>
        </div>
        <div className="stat-card">
          <div className="number">{stats.attendanceRate}%</div>
          <div className="label">Attendance Rate</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Quick Actions</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">Add Student</button>
          <button className="btn btn-success">Add Course</button>
          <button className="btn btn-warning">Mark Attendance</button>
          <button className="btn btn-danger">Record Payment</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
