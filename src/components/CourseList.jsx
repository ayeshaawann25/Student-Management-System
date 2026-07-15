import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${id}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="card-header">Course List</div>
        <Link to="/courses/add">
          <button className="btn btn-primary">
            <FaPlus /> Add Course
          </button>
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Instructor</th>
              <th>Students</th>
              <th>Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>
                <td>{course.instructor || 'N/A'}</td>
                <td>{course.enrolledStudents}/{course.maxStudents}</td>
                <td>${course.fee}</td>
                <td>
                  <Link to={`/courses/edit/${course._id}`}>
                    <button className="btn btn-primary" style={{ marginRight: '5px' }}>
                      <FaEdit />
                    </button>
                  </Link>
                  <button className="btn btn-danger" onClick={() => deleteCourse(course._id)}>
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

export default CourseList;
