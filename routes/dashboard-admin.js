var express = require('express');
var router = express.Router();
var orderModule=require('../modules/order');
var shopModule=require('../modules/catering-shops');
var path =require('path');
var multer =require('multer');
const adminModel = require('../modules/admin');
const userModel = require('../modules/user');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var getAllUsers= userModel.find({});
var getAllOrders=orderModule.find({});
var getAllShops= shopModule.find({});
/* GET home page. */
var Storage = multer.diskStorage({
  destination:"./public/uploads-shops/",
  filename:(req, file, cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }

});
var upload =multer({
  storage:Storage 
 }).single('file');

function checkLoginUser(req,res,next){
  var Usertoken=localStorage.getItem('userToken');
  console.log(Usertoken);
  try {
    var decoded = jwt.verify(Usertoken,'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}
function checkEmail(req,res,next){
  var email=localStorage.getItem('email');
  var checkexitemail=adminModel.findOne({email:email});
  checkexitemail.exec((err,data)=>{
    console.log(data);
 if(err) throw err  
 if(data==null){
  // res.render('index', { title: 'Password Management System',error:'Account has been deleted',success:''});
  res.redirect('/logout');
 }
 else{

 }
 next();
  });
}


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      if(loginUser)
      { 
        getAllUsers.exec(function(err,data1){
          getAllShops.exec(function(err,data){
            getAllOrders.exec(function(err,data2){
              if(err)throw err;
              res.render('Dashboard-admin/dashboard-admin', {email:email,record_users:data.length,record_shops:data1.length,records_order:data2.length});  
            })
           
          })
     
        })   
      
      }
    

  });
  router.get('/order',checkLoginUser,function(req, res, next) {
     var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      if(loginUser)
      {
        orderModule.find({}).exec(function(err,data){
          if(err){
            res.render('Dashboard-admin/order', { title: 'Password Management System',email:email,errors:err,success:'',records:''});        
          }
          else{
            res.render('Dashboard-admin/order', { title: 'Password Management System',email:email,errors:err,success:'',records:data});
          }
        });
      }
    // });

  });
  router.get('/order/:id',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
     
     if(loginUser)
     {
       var id=req.params.id
       orderModule.find({_id:id}).exec(function(err,data){
         if(err){
           res.render('Dashboard-admin/order', {email:email,errors:err,success:'',records:''});        
         }
         else{
           res.render('Dashboard-admin/edit-order', {email:email,errors:'',success:'',records:data[0]});
         }
       });
     }
   // });

 });

  router.post('/order/:id',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
     if(loginUser)
     {
      var id=req.params.id
      var email_user=req.body.email_user;
      var shop_email=req.body.shop_email;
      var delivery_method =req.body.delivery_method;
      var status=req.body.status;
      var quantity=req.body.quantity;
      var unit_price=req.body.unit_price;
      var dish=req.body.dish;
      var delivery_address=req.body.delivery_address;
       var update=orderModule.findByIdAndUpdate(id,{
        email_user:email_user,
        shop_email:shop_email,
        dish:dish,
        unit_price:unit_price,
        quantity:quantity,
        total_amount:req.body.total_amount,
        delivery_method:delivery_method,
        status:status,
        delivery_address:delivery_address
       })
       update.exec(function(err,data){
        if(err){
          res.render('Dashboard-admin/edit-order', { records:data,email:email,errors:err,success:'' });  
        }
        else{
        res.render('Dashboard-admin/edit-order', { records:data,email:email,errors:'',success:'Status Updated successfully' });
       }});    
   // });

 }
});
  // router.get('/settings',checkLoginUser,function(req, res, next) {
  //   var loginUser=localStorage.getItem('loginUser');
  //    var email=localStorage.getItem('email');
  //   // passModel.countDocuments({}).exec((err,count)=>{
  //   //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
  //     if(loginUser)
  //     { 
  //       adminModel.find({email:email}).exec(function(err,data){
  //         //console.log(result);
  //         console.log(data);
  //         if(err) throw err
  //         res.render('Dashboard-admin/settings', { title: 'Upload Records',records:data,email:email});
          
        
  //        });   
  //   //res.render('Dashboard-admin/settings', { title: 'Password Management System',email:email,errors:'',success:''});
  //     }
  //   // });

  // });
  router.get('/add-new-shops',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
      if(loginUser)
      {    
    res.render('Dashboard-admin/add-new-shops', {email:email,errors:'',success:'',records:''});
      }
    // });

  });
  router.post('/add-new-shops',checkLoginUser,upload,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     
      res.render('Dashboard-admin/add-new-shops', {loginUser: loginUser, errors:errors.mapped(),success:'',email:email });
  
    }else{
      var imageFile=req.file.filename;
     var shop_name=req.body.shop;
     var portfolio=req.body.fb;
     var  address=req.body.address;
     var  about=req.body.about;
     
       var shop_model =new shopModule({
        email:req.body.email,
        shop_name:shop_name,
        portfolio:portfolio,
        address:address,
        about:about,
        image:imageFile
       });
  
       shop_model.save(function(err,doc){
         if(err){
         res.render('Dashboard-admin/add-new-shops', {loginUser: loginUser, errors:err, success:'',email:email,records:''});
         }
         else{
          res.render('Dashboard-admin/add-new-shops', {loginUser: loginUser, errors:'', success:'Category created successfully',email:email,records:''});
         }
       })
      
    }
    
    });
    router.get('/shops',checkLoginUser,function(req, res, next) {
 
      var loginUser=localStorage.getItem('loginUser');
      var email=localStorage.getItem('email');
      
      var options = {
        offset:   1, 
        limit:    3
    };
    
    shopModule.find({}).exec(function(err,data){
     //console.log(result);
     if(err) throw err
     res.render('Dashboard-admin/shops', {records:data,email:email});
     
   
    });
    });
    router.get('/shops/edit/:id', function(req, res, next) {
      var Id=req.params.id;
      var email=localStorage.getItem('email');
    var edit= shopModule.findByIdAndUpdate(Id);
    edit.exec(function(err,data){
    if(err) throw err;
    res.render('Dashboard-admin/edit-new-shops', {records:data,email:email,errors:'',success:'' });
      });
      
    });
    router.get('/shops/view/:id', function(req, res, next) {
      var Id=req.params.id;
      var email=localStorage.getItem('email');
    var edit= shopModule.findById(Id);
    edit.exec(function(err,data){
    if(err) throw err;
    res.render('Dashboard-admin/view-shops', {records:data,email:email,errors:'',success:'' });
      });
    });
    router.post('/shops/:id',function(req, res, next) {
      var id =req.params.id;
      var email1=localStorage.getItem('email');
      var email =req.body.email;
        var shopname =req.body.shopname;
        var town=req.body.town;
        var city=req.body.city;
        var state=req.body.state;
       
      var update=shopModule.findByIdAndUpdate(id,{
        email:email,
        shop_name:shopname,
        town:town,
        city:city,
        state:state
      });
  update.exec(function(err,data){
  if(err) throw err;
  getAllShops.exec(function(err,data){
      if(err){
      res.render('Dashboard-admin/edit-new-shops', {records:data,success:'',errors:err,email:email1 });
      }
      else{
        res.render('Dashboard-admin/edit-new-shops', {records:data,success:' Record updated successfully',errors:'',email:email1 });
      }
    });  });
  });
  router.post('/shops/edit/:id',checkLoginUser,upload,function(req, res, next) {
    var id =req.params.id;
    var email1=localStorage.getItem('email');
    var shop_name=req.body.shop;
    var portfolio=req.body.fb;
    var  address=req.body.address;
    var  about=req.body.about;
    if(req.file){
    var shopRecords={
      email:req.body.email,
      shop_name:shop_name,
      portfolio:portfolio,
      address:address,
      about:about,
      image:req.file.filename
    }
  }
  else{
    var shopRecords={
      email:req.body.email,
      shop_name:shop_name,
      portfolio:portfolio,
      address:address,
      about:about
        }
  }
    var update=shopModule.findByIdAndUpdate(id,shopRecords);
update.exec(function(err,data){
if(err) throw err;
getAllShops.exec(function(err,data){
    if(err){
    res.render('Dashboard-admin/edit-new-shops', {records:data,success:'',errors:err,email:email1 });
    }
    else{
      res.render('Dashboard-admin/edit-new-shops', {records:data,success:' Record updated successfully',errors:'',email:email1 });
    }
  });  });
});
  router.get('/:id',checkLoginUser,checkEmail, function(req, res, next) {
    var Id=req.params.id;
    var email=localStorage.getItem('email');
    var del= shopModule.findByIdAndDelete(Id);
    del.exec(function(err,data){
      if(err)throw err;
      getAllShops.exec(function(err,data){
        if(err){
        res.render('Dashboard-admin/shops', {records:data,success:'',error:err,email:email});
        }
        else{
          res.render('Dashboard-admin/shops', {records:data,success:'Records deleted successfully',error:'',email:email});
        }
      });
    });
    
  });
  module.exports = router;