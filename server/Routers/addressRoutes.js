const express = require('express')
const router = express.Router()
const authenticate = require('../Middleware/authenticate')
const addressController = require('../Controllers/addressController')

router.get('/', authenticate, addressController.getAddress)
router.get('/address/:id',authenticate,addressController.readAddress)
router.post('/add', authenticate, addressController.addAddress)
router.put('/update/:id', authenticate, addressController.updateAddress)
router.delete('/delete/:id', authenticate, addressController.deleteAddress)

module.exports = router