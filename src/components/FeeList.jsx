import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaMoneyBill } from 'react-icons/fa';

const FeeList = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newFee, setNewFee] = useState({
    student: '',
    feeType: 'Tuition',
    amount: 0,
    dueDate: '',
    semester: '',
    academicYear: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        axios.get('/api/fees'),
        axios.get('/api/students')
      ]);
      setFees(feesRes.data);
      setStudents(studentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/fees', newFee);
      setShowForm(false);
      setNewFee({ student: '', feeType: 'Tuition', amount: 0, dueDate: '', semester: '', academicYear: '' });
      fetchData();
    } catch (error) {
      alert('Error creating fee record: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePayment = async (id) => {
    const amount = prompt('Enter payment amount:');
    if (amount && !isNaN(amount)) {
      try {
        await axios.put(`/api/fees/${id}/pay`, {
          amount: Number(amount),
          paymentMethod: 'Cash',
          transactionId: `TXN${Date.now()}`
        });
        fetchData();
      } catch (error) {
        alert('Error recording payment: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="card-header">Fee Management</div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus /> Add Fee
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <select
              className="form-control"
              value={newFee.student}
              onChange={e => setNewFee({...newFee, student: e.target.value})}
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
            <select
              className="form-control"
              value={newFee.feeType}
              onChange={e => setNewFee({...newFee, feeType: e.target.value})}
              required
            >
              <option value="Tuition">Tuition</option>
              <option value="Admission">Admission</option>
              <option value="Exam">Exam</option>
              <option value="Library">Library</option>
              <option value="Hostel">Hostel</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={newFee.amount}
              onChange={e => setNewFee({...newFee, amount: Number(e.target.value)})}
              required
            />
            <input
              type="date"
              className="form-control"
              value={newFee.dueDate}
              onChange={e => setNewFee({...newFee, dueDate: e.target.value})}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Semester"
              value={newFee.semester}
              onChange={e => setNewFee({...newFee, semester: e.target.value})}
              required
            />
            <input
              type="text"
              className="form-control"
              placeholder="Academic Year"
              value={newFee.academicYear}
              onChange={e => setNewFee({...newFee, academicYear: e.target.value})}
              required
            />
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-success">Add Fee</button>
            <button type="button" className="btn btn-danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(fee => (
              <tr key={fee._id}>
                <td>{fee.student?.firstName} {fee.student?.lastName}</td>
                <td>{fee.feeType}</td>
                <td>${fee.amount}</td>
                <td>${fee.paidAmount || 0}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${
                    fee.status === 'Paid' ? 'success' :
                    fee.status === 'Partial' ? 'warning' :
                    fee.status === 'Overdue' ? 'danger' : 'info'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td>
                  {fee.status !== 'Paid' && (
                    <button className="btn btn-success" onClick={() => handlePayment(fee._id)}>
                      <FaMoneyBill /> Pay
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeList;
