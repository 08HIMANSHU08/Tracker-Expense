const jwt = require('jsonwebtoken');

 const SignUp = require('../models/signup');

 const authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        
        const signup = jwt.verify(token,process.env.TOKEN_SECRET);
        
        SignUp.findById(signup.signupId)
        .then(signup=>{
            req.signup = signup;
            next();
        })
        .catch(err=>{
            console.log("unhandeled")
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false});
    }
 }
 

 module.exports = {authenticate};