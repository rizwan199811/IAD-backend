var orderModule=require('../../modules/order');
var getOrders=orderModule.find({});
exports.getAllOrders=function(req, res, next) {
    getOrders.exec(function(err,data){
      if(err){
        res.json({
          message:err,
        });
      }
      else{
  res.status(200).json({
    message:"success",
    results_shops:data
  });
}

})
}
exports.AddOrders=function(req, res, next) {
  var email_user=req.body.email_user;
  var shop_email=req.body.shop_email;
  var delivery_method =req.body.delivery_method;
  var status=req.body.status;
  var quantity=req.body.quantity;
  var unit_price=req.body.unit_price;
  var dish=req.body.dish;
  var delivery_address=req.body.delivery_address;

  var orderDetails=new orderModule({
    email_user:email_user,
    shop_email:shop_email,
    dish:dish,
    unit_price:unit_price,
    quantity:quantity,
    total_amount: parseInt(req.body.unit_price) * parseInt(req.body.quantity),
    delivery_method:delivery_method,
    status:status,
    delivery_address:delivery_address
  });
  orderDetails.save().then(doc=>{
    res.status(201).json({
      message:"data inserted successfully",
      results:doc
    });
    })
   .catch(err=>{
     res.json(err);
   })
}
