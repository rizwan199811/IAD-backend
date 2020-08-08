var shopModule=require('../modules/catering-shops');
var express = require('express');
var router = express.Router();
var checkauth = require('./middleware/auth');
var mongoose = require('mongoose');
var shopcontroller=require('./controller/shop')
router.get('/get-catering-shops',shopcontroller.getAllShops);
router.get('/get-menu',shopcontroller.getAllMenu);
module.exports = router;
