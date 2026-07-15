const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'courseName courseCode');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create enrollment
router.post('/', async (req, res) => {
  try {
    const { student, course, semester, academicYear } = req.body;
    
    // Check if student exists
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Check if course exists
    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ student, course });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }
    
    // Check capacity
    if (courseExists.enrolledStudents >= courseExists.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }
    
    const enrollment = new Enrollment({
      student,
      course,
      semester,
      academicYear
    });
    
    const newEnrollment = await enrollment.save();
    
    // Update course enrollment count
    await Course.findByIdAndUpdate(course, {
      $inc: { enrolledStudents: 1 }
    });
    
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update enrollment status
router.put('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete enrollment
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Decrease course enrollment count
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { enrolledStudents: -1 }
    });
    
    await enrollment.deleteOne();
    res.json({ message: 'Enrollment removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
