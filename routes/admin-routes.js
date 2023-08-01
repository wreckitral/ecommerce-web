const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/image-uploads');
const doubleCsrfProtection = require('../config/csrf');
const addCsrfTokenMiddleware = require('../middlewares/csrf-token');

const router = express.Router();

router.get('/products', doubleCsrfProtection, addCsrfTokenMiddleware, adminController.getProducts);

router.get('/products/new', doubleCsrfProtection, addCsrfTokenMiddleware, adminController.getNewProduct);

router.post('/products', imageUploadMiddleware, adminController.setNewProduct);

module.exports = router; 