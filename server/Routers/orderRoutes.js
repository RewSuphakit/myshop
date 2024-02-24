const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const { getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');

router.get('/order/:id', authenticate, getOrderById);
router.put('/status/:id', authenticate, updateOrderStatus);
router.delete('/order/:id', authenticate, deleteOrder);

module.exports = router;
