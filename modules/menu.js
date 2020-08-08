

  const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/khansamaa', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var conn =mongoose.Collection;
var menuSchema =new mongoose.Schema({
    category: {type:String, 
        required: true,
    }
    ,email:{
        type:String, 
        required: true,
    }
    ,
    dish_details:{
        type:String
    },
    image:{
        type:String
    },
    unit_price:{
        type:Number,
        required:true
    }
,
dish:{
    type:String,
    required:true
}
,
stock:{
    type:String,
    required:true
}
});

var menuModel = mongoose.model('menu',menuSchema);
module.exports=menuModel;