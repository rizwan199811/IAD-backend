var passwordcategoryModule=require('../modules/password_category');
var express = require('express');
var router = express.Router();
var checkauth = require('./middleware/auth');
var categorycontroller=require('./controller/category')
var mongoose = require('mongoose');
router.get('/getCategory',checkauth,categorycontroller.getCategory);
  router.post('/update',checkauth,categorycontroller.updateCategory);
  router.put("/add-update-category/:id",checkauth,function(req, res, next) {
    var Id=req.params.id;
    var pass_Details=req.body.pass_cat;
    passwordcategoryModule.findById(Id,function(err,data){
      data.password_category_name=pass_Details?pass_Details:data.password_category_name;
   /* data.save(function(err){
        if(err) throw err;
        res.status(201).json({
          message:"data updated successfully",
          results:data
        });    
      })
    });
    */
   data.save().then(doc=>{
    res.status(201).json({
      message:"data updated successfully",
      results:doc
    });
    })
   .catch(err=>{
     res.json(err);
   })
  });
})
  router.patch('/update-category/', function(req, res, next) {
    var Id=req.body._id;
    var pass_Details=req.body.pass_cat;
    passwordcategoryModule.findById(Id,function(err,data){
      data.password_category_name=pass_Details?pass_Details:data.password_category_name;
      data.save(function(err){
        if(err) throw err;
        res.send("Data Updated Successfully through RestAPI Patch method");    
      })
    });
  });
  router.delete('/delete/:id' ,function(req, res, next) {
   var id=req.params.id;
   passwordcategoryModule.findByIdAndRemove(id).then(doc=>{
    res.status(201).json({
      message:"data deleted successfully",
      results:doc
    });
    })
   .catch(err=>{
     res.json(err);
   })
  });
module.exports = router;