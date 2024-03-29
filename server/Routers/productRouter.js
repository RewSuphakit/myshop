// productRouter.js
const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const upload = require('../Middleware/uploads');
const { read, list, create, update, remove } = require('../Controllers/productController');
const { listCategories, createCategory, updateCategory, removeCategory } = require('../Controllers/categoryController');
const { addToCart,listCart,getCartItems, deleteCartItem, updateCartItems } = require('../Controllers/cartController');
const { listReviews, addReview, updateReview, deleteReview } = require('../Controllers/reviewsController');

// Routes for products
router.get('/products', list);
router.get('/products/:id', authenticate, read);
router.post('/products', authenticate,  upload.single('image'),create);
router.put('/products/:id', authenticate, upload.single('image'),update);
router.delete('/products/:id', authenticate, remove);

// Routes for categories
router.get('/categories', listCategories);
router.post('/categories', authenticate, createCategory);
router.put('/categories/:id', authenticate, updateCategory);
router.delete('/categories/:id', authenticate, removeCategory);

// Routes for reviews
router.get('/reviews/:id', authenticate, listReviews);
router.post('/reviews/:id', authenticate, addReview);
router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);

// Routes for cart
router.get('/cart',listCart)   
router.get('/cart/:id', authenticate, getCartItems);
router.post('/cart', authenticate, addToCart);
router.put('/cart/:id', authenticate, updateCartItems);
router.delete('/cart/:id', authenticate, deleteCartItem);

module.exports = router;
