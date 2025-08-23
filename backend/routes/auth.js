const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  passwordResetValidation,
  passwordChangeValidation,
  profileUpdateValidation
} = require('../middleware/validation');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', passwordResetValidation, authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, profileUpdateValidation, authController.updateProfile);
router.put('/change-password', authenticateToken, passwordChangeValidation, authController.changePassword);

// Admin routes
router.get('/admin/users', authenticateToken, requireRole(['admin']), (req, res) => {
  // TODO: Implement admin user management
  res.json({
    success: true,
    message: 'Admin user management endpoint'
  });
});

module.exports = router;
