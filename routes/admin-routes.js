const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/image-uploads');
const doubleCsrfProtection = require('../config/csrf');

const router = express.Router();

router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProduct);

router.post('/products', imageUploadMiddleware, doubleCsrfProtection, adminController.setNewProduct);

module.exports = router; 