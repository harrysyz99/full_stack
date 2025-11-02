const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', auth, [
  body('username').optional().trim().isLength({ min: 3, max: 30 }),
  body('bio').optional().isLength({ max: 500 }),
  body('marketAttitude').optional().isIn(['bullish', 'bearish', 'neutral', ''])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = {};
    const allowedUpdates = ['username', 'bio', 'marketAttitude', 'avatar'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id/portfolio
// @desc    Get user's public portfolio
// @access  Public
router.get('/:id/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      user: req.params.id,
      isPublic: true
    }).populate('user', 'username avatar');

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found or not public' });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
