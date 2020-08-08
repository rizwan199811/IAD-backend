var express = require('express');
var router = express.Router();
var adminModule=require('../modules/admin');
// var passCatModel = require('../modules/password_category');
// var passModel = require('../modules/add_password');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// var getPassCat= passCatModel.find({});
// var getAllPass= passModel.find({});
/* GET home page. */

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.render('index',{title:'',error:'',success:'',email:''})
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



function checkEmail(req,res,next){
  var email=req.body.email;
  console.log(email);
  var checkexistemail=adminModule.findOne({email:email});
  checkexistemail.exec((err,data)=>{
 if(err) throw err;
 if(data){
  console.log(data);
return res.render('signup', {errors:'Email Already Exist',success:''});

 }
 next();
  });
}

router.get('/',checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  console.log(loginUser);
  //  if(loginUser=="admin"){
if(loginUser=="admin")
{
  res.redirect('/dashboard-admin');
}
else{
if(loginUser=="shop owner")
{
    res.redirect('/dashboard-shop-owner');
}
else{
  res.render('index',{title:'',error:'',email:''})
}
}
}
    // localStorage.removeItem('userToken');
    // localStorage.removeItem('loginUser');
    // res.redirect('/');
    // }
    // else{
    // if(loginUser=="shop owner"){
      // res.redirect('./dashboard-shop-owner');
     // localStorage.removeItem('userToken');
      //localStorage.removeItem('loginUser');
      //res.redirect('/');
      // }
        // else{
      // res.render('index',{error:'',title:'Login Page Khansamaa'});    
        // }
      // }
);

router.post('/',function(req, res, next) {
  var email=req.body.email;  
  var password=req.body.password;
  console.log(email);
  var checkUser=adminModule.findOne({email:email});
checkUser.exec((err, data)=>{
    console.log("data is:" +data);
   if(data==null){
    res.render('index', { title: 'Login Khansamaa', error:"Data not found" });

   }else{
if(err) throw err;
var getUserID=data._id;
var getPassword=data.password;
var getStatus=data.register_as;
console.log(getStatus);
if(bcrypt.compareSync(password,getPassword)){
  var token = jwt.sign({ userID: getUserID }, 'loginToken');
  console.log(token);
  localStorage.setItem('userToken',token);
  localStorage.setItem('loginUser',getStatus);
  localStorage.setItem('email',email);
  if(getStatus=='admin'){
     res.redirect('/dashboard-admin'); 
  }
  else{
  if(getStatus=='shop owner'){
    res.redirect('/dashboard-shop-owner'); 
 }
 else{
  res.redirect('/');
 }
}
   }
  }
  });
 
});


router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  // if(loginUser){
  //   res.redirect('./dashboard');
  // }else{
  res.render('signup', { errors:'',success:''});
  // }
});
router.post('/signup',checkEmail,function(req, res, next) {
        var username=req.body.uname;
        var email=req.body.email;
        var password=req.body.password;
        var confpassword=req.body.confpassword;
        var reg_as=req.body.register;
        var phone=req.body.phone_number;
        var address=req.body.address;
        var postal=req.body.postal_code;
  if(password !=confpassword){
    res.render('signup', {errors:'Password not matched!',success:''});
   
  }else{
    password =bcrypt.hashSync(req.body.password,10);
      var userDetails=new adminModule({
        username:username,
        email:email,
        password:password,
        register_as:reg_as,
        phone_number:phone,
        postal_code:postal,
        address:address
      });
    } 
        userDetails.save((err,doc)=>{
          if(err){
            res.render('signup', {  errors:err,success:''});  
          }
          else{   
          res.render('signup', {success:'User Registered Successfully',errors:''});
          }
         })
  
});
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('LoginUserToken');
  localStorage.removeItem('email');
  res.redirect('/');
});

module.exports = router;
