import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import sendOtp from '../utils/sendOtp.js';

const router = express.Router();

// Helper — generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── SEND OTP ───────────────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Delete any previous OTP for this email
    await Otp.deleteMany({ email });

    const otp = generateOtp();
    const hashed = await bcrypt.hash(otp, 10);

    await Otp.create({ email, otp: hashed });
    await sendOtp(email, otp);

    res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Try again.' });
  }
});

// ─── VERIFY OTP ─────────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });
    }

    // Mark as verified
    record.verified = true;
    await record.save();

    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Verification failed. Try again.' });
  }
});

// ─── SIGNUP ─────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    // Check OTP was verified
    const otpRecord = await Otp.findOne({ email, verified: true });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role });

    // Clean up OTP record
    await Otp.deleteMany({ email });

    res.status(201).json({ message: 'Account created successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed. Try again.' });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, role: user.role, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Try again.' });
  }
});

export default router;