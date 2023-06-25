
const express = require('express');

const router = express.Router(); 

const featureController = require('../controllers/premiumfeature');

const userAuthentication = require('../middlewares/auth');

router.get('/show-leaderboard',userAuthentication.authenticate,featureController.getLeaderBoard);

module.exports = router;