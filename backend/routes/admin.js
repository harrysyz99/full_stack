const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Admin
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const [totalUsers, totalPosts, activePosts, deletedPosts] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ isDeleted: false }),
      Post.countDocuments({ isDeleted: true })
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt role');

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        activePosts,
        deletedPosts
      },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/posts/:id/pin
// @desc    Pin/unpin a post
// @access  Admin
router.put('/posts/:id/pin', auth, isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({ message: `Post ${post.isPinned ? 'pinned' : 'unpinned'}`, post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/posts/:id/lock
// @desc    Lock/unlock a post
// @access  Admin
router.put('/posts/:id/lock', auth, isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isLocked = !post.isLocked;
    await post.save();

    res.json({ message: `Post ${post.isLocked ? 'locked' : 'unlocked'}`, post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/admin/posts/:id
// @desc    Delete a post (admin override)
// @access  Admin
router.delete('/posts/:id', auth, isAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    post.deletedBy = req.userId;
    await post.save();

    res.json({ message: 'Post deleted by admin' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Admin
router.put('/users/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
