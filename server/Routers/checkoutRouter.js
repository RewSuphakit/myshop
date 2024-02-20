const express = require('express');
const router = express.Router();
const checkoutController = require('../Controllers/checkoutController');

// Route เพื่อทำการ Check out สินค้า
router.post('/checkout', checkoutController.checkout);
module.exports = router;