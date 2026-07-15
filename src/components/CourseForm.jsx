import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({
    courseName: '',
    description: '',
    credits: 3,
    duration: '',
    instructor: '',
    maxStudents: 30,
    department: '',
    semester: '',
    fee: 0
  });

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: name === 'credits' || name === 'maxStudents' || name === 'fee' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/courses/${id}`, course);
      } else {
        await axios.post('/api/courses', course);
      }
      navigate('/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">{id ? 'Edit Course' : 'Add New Course'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Course Name *</label>
            <input
              type="text"
              name="courseName"
              className="form-control"
              value={course.courseName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Credits *</label>
            <input
              type="number"
              name="credits"
              className="form-control"
              value={course.credits}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Duration *</label>
            <input
              type="text"
              name="duration"
              className="form-control"
              value={course.duration}
              onChange={handleChange}
              placeholder="e.g., 16 weeks"
              required
            />
          </div>
          <div className="form-group">
            <label>Instructor</label>
            <input
              type="text"
              name="instructor"
              className="form-control"
              value={course.instructor}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={course.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Semester *</label>
            <input
              type="text"
              name="semester"
              className="form-control"
              value={course.semester}
              onChange={handleChange}
              placeholder="e.g., Fall 2024"
              required
            />
          </div>
          <div className="form-group">
            <label>Max Students *</label>
            <input
              type="number"
              name="maxStudents"
              className="form-control"
              value={course.maxStudents}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Course Fee ($) *</label>
            <input
              type="number"
              name="fee"
              className="form-control"
              value={course.fee}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={course.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Course' : 'Add Course')}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => navigate('/courses')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
