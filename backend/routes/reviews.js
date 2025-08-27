const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/validation');
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  approveReview
} = require('../controllers/reviewController');

// Public routes (no authentication required)
router.get('/', getAllReviews);
router.get('/:id', getReviewById);

// User routes (require authentication)
router.use(authenticateToken);

router.post('/', createReview);
router.put('/:id', updateReview);

// Admin routes (require admin role)
router.use(requireAdmin);

router.delete('/:id', deleteReview);
router.patch('/:id/approve', approveReview);

module.exports = router;
