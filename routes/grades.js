const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');

// Get all grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'courseName courseCode');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update grade
router.post('/', async (req, res) => {
  try {
    const { student, course, semester, academicYear, ...scores } = req.body;
    
    // Check if grade exists for this student and course
    let grade = await Grade.findOne({ student, course, semester, academicYear });
    
    if (grade) {
      // Update existing grade
      Object.assign(grade, scores);
      await grade.save();
      res.json(grade);
    } else {
      // Create new grade
      grade = new Grade({
        student,
        course,
        semester,
        academicYear,
        ...scores
      });
      const newGrade = await grade.save();
      res.status(201).json(newGrade);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get grades for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('course', 'courseName courseCode');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
