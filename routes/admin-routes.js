const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/image-uploads');
const { doubleCsrfProtection } = require('../config/csrf');
const addCsrfTokenMiddleware = require('../middlewares/csrf-token');

const router = express.Router();

router.get('/products', addCsrfTokenMiddleware, adminController.getProducts);

router.get('/products/new', addCsrfTokenMiddleware, adminController.getNewProduct);

router.post('/products', imageUploadMiddleware, doubleCsrfProtection, adminController.setNewProduct);

module.exports = router; 