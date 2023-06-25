

const express = require('express');

const router = express.Router(); 

const premiumController = require('../controllers/purchase');

const userAuthentication = require('../middlewares/auth');

router.get('/buypremiummembership',userAuthentication.authenticate,premiumController.getPurchase);

router.post('/updatetransactionstatus',userAuthentication.authenticate,premiumController.postPurchase);


module.exports = router;