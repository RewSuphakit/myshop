// productRouter.js
const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');
const { read, list, create, update, remove } = require('../Controllers/productController');
const { listCategories, createCategory, updateCategory, removeCategory } = require('../Controllers/categoryController');
const  {addToCart,getCartItems,deleteCartItem,updateCartItems} = require('../Controllers/cartController')
const {listReviews,addReview,updateReview,deleteReview} = require('../Controllers/reviewsController')

// http://localhost:8000/api/products/
// Require controller modules.
router.get('/products', list);
router.get('/products/:id', authenticate, read);
router.post('/products', authenticate, create);
router.put('/products/:id', authenticate, update);
router.delete('/products/:id', authenticate, remove);
// http://localhost:8000/api/categories/
// Routes for categories  
router.get('/categories', listCategories);
router.post('/categories', authenticate, createCategory);
router.put('/categories/:id', authenticate, updateCategory);
router.delete('/categories/:id', authenticate, removeCategory);
// Router for reviews
// http://localhost:8000/api/reviews/
router.get('/reviews/:id',authenticate,listReviews)
router.post("/reviews/:id", authenticate, addReview)
router.put("/reviews/:id", authenticate, updateReview)
router.delete("/reviews/:id", authenticate, deleteReview)
// http://localhost:8000/api/cart/
// Routes for Cart
router.post("/cart",authenticate, addToCart)
router.get("/cart/:id",authenticate, getCartItems)
router.put("/cart/:id", authenticate, updateCartItems);
router.delete("/cart/:id",authenticate, deleteCartItem)

module.exports = router;
