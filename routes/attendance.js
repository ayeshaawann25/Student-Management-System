const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get all attendance
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'courseName courseCode');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance
router.post('/', async (req, res) => {
  try {
    const { student, course, date, status, semester, checkInTime, remarks } = req.body;
    
    // Check if attendance already marked for this day
    let attendance = await Attendance.findOne({ student, course, date });
    
    if (attendance) {
      attendance.status = status;
      attendance.checkInTime = checkInTime || attendance.checkInTime;
      attendance.remarks = remarks || attendance.remarks;
      await attendance.save();
      res.json(attendance);
    } else {
      attendance = new Attendance({
        student,
        course,
        date: new Date(date),
        status,
        semester,
        checkInTime,
        remarks
      });
      const newAttendance = await attendance.save();
      res.status(201).json(newAttendance);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get attendance for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate('course', 'courseName courseCode');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics for a course
router.get('/stats/:courseId', async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      { $match: { course: req.params.courseId } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
