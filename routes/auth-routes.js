const express = require('express');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', authController.setSignup);

router.get('/login', authController.getLogin);

router.post('/login', authController.setLogin);

router.post('/logout', authController.logout);

module.exports = router;