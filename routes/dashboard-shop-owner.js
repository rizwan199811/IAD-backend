var express = require('express');
var router = express.Router();
var userModule=require('../modules/admin');
var shopModule=require('../modules/catering-shops');
var menuModule=require('../modules/menu');
var categoryModule=require('../modules/category');
var orderModule=require('../modules/order');
var multer =require('multer');
var bcrypt =require('bcryptjs');
var path =require('path');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const e = require('express');
const adminModel = require('../modules/admin');
var getAllShops= shopModule.find({});
var getAllMenu= menuModule.find({});
var getAllOrders=orderModule.find({});
var getAllCategory= categoryModule.find({});
/* GET home page. */
var Storage = multer.diskStorage({
  destination:"./public/uploads/",
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
  var checkexistemail=adminModel.findOne({email:email});
  checkexistemail.exec((err,data)=>{
    console.log(data);
    if(err) throw err;
 if(data==null){
  res.render('index', { title: 'Password Management System',error:'Account has been deleted',success:''});
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
     console.log("Login user is:"+loginUser)

    
      if(loginUser)
      {
        categoryModule.find({email:email}).exec(function(err,data){
          if(err) throw err;
          menuModule.find({email:email}).exec(function(err,data1){
            getAllOrders.exec(function(err,data2){
            res.render('Dashboard-shop-owner/dashboard-shop', {email:email,records_category:data.length,records_menu:data1.length,records_orders:data2.length});        
          })
        })
        })    
      }
    
  });
  router.get('/orders',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
   
     if(loginUser)
     {
       orderModule.find({shop_email:email}).exec(function(err,data){
         if(err){
           res.render('Dashboard-shop-owner/order', {email:email,errors:err,success:'',records:''});        
         }
         else{
           res.render('Dashboard-shop-owner/order', {email:email,errors:err,success:'',records:data});
         }
       });
     }
   // });

 });
 router.get('/orders/:id',checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var email=localStorage.getItem('email');
   if(loginUser)
   {
     var id=req.params.id
     orderModule.find({_id:id}).exec(function(err,data){
       if(err){
         res.render('Dashboard-shop-owner/order', { email:email,errors:err,success:'',records:''});        
       }
       else{
         res.render('Dashboard-shop-owner/edit-order', {email:email,errors:'',success:'',records:data[0]});
       }
     });
   }
 // });

});

 router.post('/orders/:id',checkLoginUser,function(req, res, next) {
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
        res.render('Dashboard-shop-owner/edit-order', {records:data,email:email,errors:err,success:'' });  
      }
      else{
      res.render('Dashboard-shop-owner/edit-order', { records:data,email:email,errors:'',success:'Status Updated successfully' });
     }});    
 // });

}
});
  router.get('/dishes',checkLoginUser,function(req, res, next) {
 
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
    menuModule.find({email:email}).exec(function(err,data){
   //console.log(result);
   if(err) throw err
   res.render('Dashboard-shop-owner/dishes', {records:data,email:email});
   
  });
  });

  router.get('/add-new-dishes',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      if(loginUser)
      {
        categoryModule.find({email:email}).exec(function(err,data){
          if(err){
            res.render('Dashboard-shop-owner/add-new-dishes', {loginUser: loginUser, errors:err, success:'',email:email,records:''});
          }
          else{
              res.render('Dashboard-shop-owner/add-new-dishes', {loginUser: loginUser, errors:'', success:'',email:email,records:data});
        }});  
      }
  });
  router.post('/add-new-dishes',checkLoginUser,upload,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     
      res.render('Dashboard-shop-owner/add-new-dishes', {loginUser: loginUser, errors:errors.mapped(),success:'',email:email });
  
    }else{
      var imageFile=req.file.filename;
      var category =req.body.category;
      var dish_details=req.body.dish_details;
      var unit_price =req.body.unit_price;
      var dish =req.body.dish;
      var stock=req.body.stock;
       var menu_model =new menuModule({
        category:category,
        dish_details:dish_details,
        image:imageFile,
        email:email,
        unit_price:unit_price,
        dish:dish,
        stock:stock
       });
      
          menu_model.save(function(err,doc){
            if(err){
              res.render('Dashboard-shop-owner/add-new-dishes', { loginUser: loginUser, errors:err, success:'',email:email,records:''});
            }
            else{
            categoryModule.find({email:email}).exec(function(err,data){
              if(err){
                res.render('Dashboard-shop-owner/add-new-dishes', { loginUser: loginUser, errors:err, success:'',email:email,records:''});
                }
                else{
                res.render('Dashboard-shop-owner/add-new-dishes', {loginUser: loginUser, errors:err, success:'Category created successfully',email:email,records:data}); 
                
                }
            }
            )
          }
        
       }
          )
      
    }
  });
    
    router.get('/dishes/:id',function(req, res, next) {
      var Id=req.params.id;
      var email=localStorage.getItem('email');
    var edit= menuModule.findById(Id);
    edit.exec(function(err,data){
    if(err) throw err;
    res.render('Dashboard-shop-owner/edit-new-dishes', {records:data,email:email,errors:'',success:'' });
      });
    });
    router.get('/dishes/view/:id', function(req, res, next) {
      var Id=req.params.id;
      var email=localStorage.getItem('email');
    var edit= menuModule.findById(Id);
    edit.exec(function(err,data){
    if(err) throw err;
    res.render('Dashboard-shop-owner/view-dishes', { records:data,email:email,errors:'',success:'' });
      });
    });
    router.post('/dishes/:id',checkLoginUser,upload,function(req, res, next) {
      var id =req.params.id;
      var email1=localStorage.getItem('email');
      var category =req.body.category;
      var dish_details=req.body.dish_details;
      var unit_price =req.body.unit_price;
      var dish =req.body.dish;
      var stock=req.body.stock;
      if(req.file){
      var dishRecords={
        category:category,
        dish_details:dish_details,
        email:email1,
        unit_price:unit_price,
        dish:dish,
        stock:stock,
        image:req.file.filename
      }
    }
    else{
      var dishRecords={
        category:category,
        dish_details:dish_details,
        email:email1,
        unit_price:unit_price,
        dish:dish,
        stock:stock
      }
    }
      var update=menuModule.findByIdAndUpdate(id,dishRecords);
  update.exec(function(err,data){
  if(err) throw err;
  getAllMenu.exec(function(err,data){
    if(err){
      res.render('Dashboard-shop-owner/edit-new-dishes', {records:data,success:'',errors:err,email:email1 });
    }
    else{
    getAllMenu.exec(function(err,data1){
      // if(err){
      // res.render('Dashboard-shop-owner/edit-new-dishes', { title: 'Employee Records', records:data,success:'',errors:err,email:email1 });
      // }
      // else{
        res.render('Dashboard-shop-owner/edit-new-dishes', {records:data,success:' Record updated successfully',errors:'',email:email1 });
      // }   
    })
  }
    }); 
   });
  });
  router.get('/dishes/delete/:id',checkLoginUser,checkEmail, function(req, res, next) {
    var Id=req.params.id;
    var email=localStorage.getItem('email');
    var del= menuModule.findByIdAndDelete(Id);
    del.exec(function(err,data){
      if(err)throw err;
      getAllMenu.exec(function(err,data){
        if(err){
        res.render('Dashboard-shop-owner/dishes', {records:data,success:'',error:err,email:email});
        }
        else{
          res.redirect('/dashboard-shop-owner/dishes')
        }
      });
    });
    
  });
   router.get('/category',checkLoginUser,function(req, res, next) {

    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
     console.log("Login user is:"+loginUser)
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      categoryModule.find({email:email}).exec(function(err,data){
        //console.log(result);
        if(err) throw err
        res.render('Dashboard-shop-owner/categories', { title: 'Upload Records', records:data,email:email});
        
       });
    // });

  });
  router.get('/category/:id',function(req, res, next) {
    var Id=req.params.id;
    var email=localStorage.getItem('email');
  var edit= categoryModule.findById(Id);
  edit.exec(function(err,data){
  if(err) throw err;
  res.render('Dashboard-shop-owner/edit-new-categories', {records:data,email:email,errors:'',success:'' });
    });
  });
  router.post('/category/:id',checkLoginUser,upload,function(req, res, next) {
    var id =req.params.id;
    var email1=localStorage.getItem('email');
    var category =req.body.category;
    var category_details=req.body.category_details;
    var update=categoryModule.findByIdAndUpdate(id,{
      category:category,
      category_details:category_details,
    });
update.exec(function(err,data){
if(err) throw err;
getAllCategory.exec(function(err,data){
    if(err){
    res.render('Dashboard-shop-owner/edit-new-categories', {records:data,success:'',errors:err,email:email1 });
    }
    else{
      res.render('Dashboard-shop-owner/edit-new-categories', {records:data,success:' Record updated successfully',errors:'',email:email1 });
    }
  });  });
});
router.get('/category/delete/:id',checkLoginUser,checkEmail, function(req, res, next) {
  var Id=req.params.id;
  var email=localStorage.getItem('email');
  var del= categoryModule.findByIdAndDelete(Id);
  del.exec(function(err,data){
    if(err)throw err;
    getAllCategory.exec(function(err,data){
      if(err){
      res.render('Dashboard-shop-owner/categories', { records:data,success:'',error:err,email:email});
      }
      else{
        res.redirect('/dashboard-shop-owner/category')
      }
    });
  });
  
});

  router.get('/add-new-category',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
   
      if(loginUser)
      {    
    res.render('Dashboard-shop-owner/add-new-categories', {email:email,errors:'',success:'',records:''});
      }

  });
  router.post('/add-new-category',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var email=localStorage.getItem('email');
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     
      res.render('Dashboard-shop-owner/add-new-categories', {loginUser: loginUser, errors:errors.mapped(),success:'',email:email });
  
    }else{
      var category=req.body.category;
      console.log(category);
      var category_details=req.body.category_details;
       var category_model =new categoryModule({
        category:category,
        category_details:category_details,
        email:email
       });
  
       category_model.save(function(err,doc){
         if(err){
         res.render('Dashboard-shop-owner/add-new-categories', {loginUser: loginUser, errors:err, success:'',email:email,records:''});
         }
         else{
          res.render('Dashboard-shop-owner/add-new-categories', {loginUser: loginUser, errors:'', success:'Category created successfully',email:email,records:''});
         }
       })
      
    }
    
    });
  router.get('/location',checkLoginUser,function(req, res, next) {

    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
     console.log("Login user is:"+loginUser)
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      if(loginUser)
      {    
    res.render('Dashboard-shop-owner/location', {email:email,errors:'',success:'',records:''});
      }
    // });

  });
  router.get('/add-new-location',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      if(loginUser)
      {    
    res.render('Dashboard-shop-owner/add-new-location', {email:email,errors:'',success:'',records:''});
      }
    // });

  });
  router.get('/orders',checkLoginUser,function(req, res, next) {

    var loginUser=localStorage.getItem('loginUser');
     var email=localStorage.getItem('email');
     console.log("Login user is:"+loginUser)
    // passModel.countDocuments({}).exec((err,count)=>{
    //        passCatModel.countDocuments({}).exec((err,countasscat)=>{
      if(loginUser)
      {    
        orderModule.find({email:email}).exec(function(err,data){
          if(err){
            res.render('Dashboard-shop-owner/order', {email:email,errors:err,success:'',records:''});        
          }
          else{
            res.render('Dashboard-shop-owner/order', {email:email,errors:err,success:'',records:data});
          }
        });
    
      }
  });
  
  module.exports = router;