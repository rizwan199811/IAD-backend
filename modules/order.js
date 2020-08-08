const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/khansamaa', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var conn =mongoose.Collection;

var orderSchema =new mongoose.Schema({
email_user:{
    type:String
}
,
shop_email:{
    type:String,
    required: true,
},
dish:{
    type:String,
    required: true,
}
,
quantity:{
    type:Number,
    required: true,
}
,
unit_price:{
    type:Number,
    required: true,
}
,
    status: {
        type:String,
        required: true,
        default:'pending'
    },
    delivery_method: {
        type:String, 
        required: true
    },
    delivery_address: {
        type:String, 
        required: true
    },
    
    total_amount: {
        type:Number, 
        required: true
    },
    date:{
        type: Date, 
        default: Date.now }
});

var orderModel = mongoose.model('orders',orderSchema);
module.exports=orderModel;