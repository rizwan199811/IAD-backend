var jwt = require('jsonwebtoken');
module.exports=(req,res,next)=>{
    try{
        var Token=req.headers.authorization.split(' ')[1];
       var decode= jwt.verify(Token,process.env.SECRET_KEY);
    //    console.log(process.env.SECRET_KEY);
       req.userData=decode;
    next();
    }catch(error){
        res.status(401).json({
            error:"Invalid Token"+error
            
                 
        });
    }

}