// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../Middleware/authenticate');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/profile',authenticate, authController.getUserProfile);
module.exports = router;
