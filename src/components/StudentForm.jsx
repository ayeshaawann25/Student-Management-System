import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    status: 'Active'
  });

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`/api/students/${id}`);
      const data = res.data;
      setStudent({
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : ''
      });
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStudent(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setStudent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/students/${id}`, student);
      } else {
        await axios.post('/api/students', student);
      }
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">{id ? 'Edit Student' : 'Add New Student'}</div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={student.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={student.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={student.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={student.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              className="form-control"
              value={student.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender *</label>
            <select
              name="gender"
              className="form-control"
              value={student.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <h3 style={{ margin: '20px 0 10px' }}>Address</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              name="address.street"
              className="form-control"
              value={student.address.street}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="address.city"
              className="form-control"
              value={student.address.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="address.state"
              className="form-control"
              value={student.address.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="address.zipCode"
              className="form-control"
              value={student.address.zipCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="address.country"
              className="form-control"
              value={student.address.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <h3 style={{ margin: '20px 0 10px' }}>Guardian Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Guardian Name</label>
            <input
              type="text"
              name="guardianName"
              className="form-control"
              value={student.guardianName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Guardian Phone</label>
            <input
              type="text"
              name="guardianPhone"
              className="form-control"
              value={student.guardianPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Guardian Email</label>
            <input
              type="email"
              name="guardianEmail"
              className="form-control"
              value={student.guardianEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Student' : 'Add Student')}
          </button>
          <button type="button" className="btn btn-danger" onClick={() => navigate('/students')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
