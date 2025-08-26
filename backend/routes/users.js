const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, userUpdateValidation } = require('../middleware/validation');
const {
  getAllUsers,
  getUserByIdAdmin,
  updateUser,
  deleteUser,
  updateUserBalance
} = require('../controllers/userController');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users with pagination and search
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserByIdAdmin);

// Update user
router.put('/:id', userUpdateValidation, updateUser);

// Delete user
router.delete('/:id', deleteUser);

// Update user balance
router.patch('/:id/balance', updateUserBalance);

module.exports = router;
