const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeType: {
    type: String,
    enum: ['Admission', 'Tuition', 'Exam', 'Library', 'Hostel', 'Other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paymentDate: Date,
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Partial'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Credit Card', 'Online'],
  },
  transactionId: String,
  semester: String,
  academicYear: String,
  remarks: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema);
