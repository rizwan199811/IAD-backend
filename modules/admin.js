const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/khansamaa', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var conn =mongoose.Collection;
var adminSchema =new mongoose.Schema({
    username: {type:String, 
        required: true,
    },
	email: {
        type:String, 
        required: true, 
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type:String, 
        required: true
    },
    register_as: {
        type:String,
        required: true
    },
    phone_number: {
        type:Number, 
        required: true,
        match:/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/
    },
    
    postal_code: {
        type:Number, 
        required: true,
        match:/^([a-zA-Z0-9][\s\\/-]*){8}$/
    },
    date:{
        type: Date, 
        default: Date.now }
});

var adminModel = mongoose.model('ADMINS',adminSchema);
module.exports=adminModel;