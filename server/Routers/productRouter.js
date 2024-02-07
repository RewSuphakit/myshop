// productRouter.js
const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const { read, list, create, update, remove } = require('../Controllers/productController');

// Require controller modules.
router.get('/products', authenticate, list);
router.get('/products/:id', authenticate, read);
router.post('/products', authenticate, create);
router.put('/products/:id', authenticate, update);
router.delete('/products/:id', authenticate, remove);

module.exports = router;
