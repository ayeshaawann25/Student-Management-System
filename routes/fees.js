const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// Get all fees
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'firstName lastName studentId');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create fee
router.post('/', async (req, res) => {
  try {
    const fee = new Fee(req.body);
    const newFee = await fee.save();
    res.status(201).json(newFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Record payment
router.put('/:id/pay', async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }
    
    fee.paidAmount = (fee.paidAmount || 0) + amount;
    fee.paymentDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    
    if (fee.paidAmount >= fee.amount) {
      fee.status = 'Paid';
    } else if (fee.paidAmount > 0) {
      fee.status = 'Partial';
    }
    
    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get fees for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
