import express from 'express';
import Complaint from '../models/Complaint.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Submit a complaint (Public)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.create({
      user: req.user._id,
      text: req.body.text,
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Complaint submission failed' });
  }
});

// Get all complaints (Gov only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'government') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const complaints = await Complaint.find().populate('user', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

export default router;
