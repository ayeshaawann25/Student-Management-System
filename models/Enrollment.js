const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Enrolled', 'Completed', 'Dropped', 'Pending'],
    default: 'Enrolled'
  },
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure one student can't enroll in same course twice
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
