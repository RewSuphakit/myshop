// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const authenticate = require('../Middleware/authenticate');
// login
router.post('/register', authController.register);
router.post('/login', authController.login);
//auth/
router.get('/countUsers',authenticate,authController.CountUsers);
router.get('/profile',authenticate, authController.getUserProfile);
router.put('/profile/:id', authenticate, authController.updateUserProfile);
module.exports = router;
