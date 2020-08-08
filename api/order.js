var orderModule=require('../modules/order');
var express = require('express');
var router = express.Router();
var checkauth = require('./middleware/auth');
var mongoose = require('mongoose');
var ordercontroller=require('./controller/order')
router.get('/get-orders',ordercontroller.getAllOrders);
router.post('/orders',ordercontroller.AddOrders);
module.exports = router;
