const express = require('express');

const cartController = require('../controllers/cart-controller');

const addCsrfTokenMiddleware = require('../middlewares/csrf-token');

const router = express.Router();

router.get('/', addCsrfTokenMiddleware, cartController.getCart)

router.post('/items', cartController.addCartItem);

router.patch('/items', cartController.updateCartItem);

module.exports = router;