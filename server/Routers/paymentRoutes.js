const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const {getAllPayments,createPayment} = require('../Controllers/paymentsController');

router.get('/payments',authenticate,getAllPayments);
router.post('/payments',authenticate,createPayment);



module.exports = router;
