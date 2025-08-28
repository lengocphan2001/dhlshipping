const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Public routes (require authentication)
router.get('/stats', authenticateToken, adminMiddleware, orderController.getOrderStats);
router.get('/', authenticateToken, orderController.getOrders);
router.get('/:id', authenticateToken, orderController.getOrder);
router.post('/', authenticateToken, orderController.createOrder);

// Admin-only routes
router.patch('/:id/status', authenticateToken, adminMiddleware, orderController.updateOrderStatus);
router.put('/:id', authenticateToken, adminMiddleware, orderController.updateOrder);
router.delete('/:id', authenticateToken, adminMiddleware, orderController.deleteOrder);

module.exports = router;
