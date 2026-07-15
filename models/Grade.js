const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
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
  semester: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  assignment1: {
    score: Number,
    maxScore: Number,
    weight: Number
  },
  assignment2: {
    score: Number,
    maxScore: Number,
    weight: Number
  },
  midterm: {
    score: Number,
    maxScore: Number,
    weight: Number
  },
  finalExam: {
    score: Number,
    maxScore: Number,
    weight: Number
  },
  totalScore: {
    type: Number,
    default: 0
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F']
  },
  remarks: String
}, {
  timestamps: true
});

// Calculate total score before saving
gradeSchema.pre('save', function(next) {
  const total = (this.assignment1?.score || 0) + 
                (this.assignment2?.score || 0) + 
                (this.midterm?.score || 0) + 
                (this.finalExam?.score || 0);
  this.totalScore = total;
  
  // Calculate grade based on total score
  const percentage = (total / 400) * 100;
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 75) this.grade = 'A-';
  else if (percentage >= 70) this.grade = 'B+';
  else if (percentage >= 65) this.grade = 'B';
  else if (percentage >= 60) this.grade = 'B-';
  else if (percentage >= 55) this.grade = 'C+';
  else if (percentage >= 50) this.grade = 'C';
  else if (percentage >= 45) this.grade = 'C-';
  else if (percentage >= 40) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
