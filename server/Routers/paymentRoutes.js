const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const { listOrder, readOrder, addOrder, updateOrder, deleteOrder } = require('../Controllers/orderController');

router.get('/orders', authenticate, listOrder);
router.get('/orders/:id', authenticate, readOrder);
router.post('/orders', authenticate, addOrder);
router.put('/orders/:id', authenticate, updateOrder);
router.delete('/orders/:id', authenticate, deleteOrder);

module.exports = router;
