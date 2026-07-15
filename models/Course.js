const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  description: String,
  credits: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: String,
    required: true
  },
  instructor: String,
  maxStudents: {
    type: Number,
    default: 30
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  department: String,
  semester: String,
  fee: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
