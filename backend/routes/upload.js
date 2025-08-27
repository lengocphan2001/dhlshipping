const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Upload image endpoint (admin only)
router.post('/', authenticateToken, requireAdmin, uploadImage);

module.exports = router;
