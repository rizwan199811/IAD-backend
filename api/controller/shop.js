var shopModule=require('../../modules/catering-shops');
var menuModule=require('../../modules/menu');
var getShop=shopModule.find({});
exports.getAllShops=function(req, res, next) {
    getShop.exec(function(err,data){
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
exports.getAllMenu=function(req, res, next) {
  var email=req.body.email;
  menuModule.find({email:email}).exec(function(err,data){
    if(err){
      res.json({
        message:err,
      });
    }
    else{
res.status(200).json({
  message:"success",
  results_menu:data
});
}
})
}
