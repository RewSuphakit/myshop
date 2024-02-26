const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const { getOrderById, updateOrderStatus, deleteOrder ,countOrder,listOrder} = require('../Controllers/orderController');

router.get('/countOrder',authenticate,countOrder);
router.get('/listOrder',authenticate,listOrder);
router.get('/order/:id', authenticate, getOrderById);
router.put('/status/:id', authenticate, updateOrderStatus);
router.delete('/order/:id', authenticate, deleteOrder);

module.exports = router;
