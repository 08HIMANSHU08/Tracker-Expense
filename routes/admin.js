

const express = require('express');

const router = express.Router();

const authenticate = require('../middlewares/auth');

const signupController = require('../controllers/sign');

const loginController = require('../controllers/login');

const expenseController = require('../controllers/expense');

router.post('/signup',signupController.postSignup);

router.post('/login',loginController.postLogin);

router.get('/download',authenticate.authenticate,expenseController.downloadExpense);

module.exports = router;