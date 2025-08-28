const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { updateUserProfile, getUserProfile } = require('../controllers/userProfileController');

// Get user profile
router.get('/profile', authenticateToken, getUserProfile);

// Update user profile
router.put('/profile', authenticateToken, updateUserProfile);

module.exports = router;
