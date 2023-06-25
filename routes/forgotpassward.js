
const express = require('express');

const router = express.Router(); 

const forgotPasswardController = require('../controllers/forgot');
const resetPasswardController = require('../controllers/resetpassward')

const userAuthentication = require('../middlewares/auth');

router.post('/forgotpassword',forgotPasswardController.postForgetPassword);

router.get('/updatepassword/:resetpasswordid',resetPasswardController.updatePassward);

router.get('/resetpassword/:uuid',resetPasswardController.getResetpassward);

module.exports = router;
