var passwordcategoryModule=require('../../modules/password_category');
var getPasswordcategory=passwordcategoryModule.find({});
exports.getCategory=function(req, res, next) {
    getPasswordcategory.exec(function(err,data){
        if(err) throw err;
        res.status(200).json({
          message:"success",
          results:data.email
        });
    })
}

exports.updateCategory=function(req, res, next) {
    
    var password_category=req.body.pass_cat;
    var password_categoryDetails=new passwordcategoryModule({password_category_name:password_category});
    /*  password_categoryDetails.save(function(err,doc){
    if(err) throw err;
        res.status(201).json({
          message:"data inserted successfully",
          results:doc
        });
      
    });
    */
   password_categoryDetails.save().then(doc=>{
    res.status(201).json({
      message:"data inserted successfully",
      results:doc
    });
    })
   .catch(err=>{
     res.json(err);
   })
  }