const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/khansamaa',{useNewUrlParser: true, useCreateIndex: true});
var conn =mongoose.Collection;
var shopsSchema =new mongoose.Schema({
	email: {
        type:String, 
        required: true, 
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        unique:true
    },
    shop_name: {
        type:String, 
        required: true,
        unique:true
    },
    portfolio:{

    },
    address: {
        type:String,
        required: true
    },
    about: {
        type:String,
    },
    image: {
        type:String,
        required: true
    },
    
    
    date:{
        type: Date, 
        default: Date.now }
});

var shopsModel = mongoose.model('shops', shopsSchema);
module.exports=shopsModel;