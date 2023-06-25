const jwt = require('jsonwebtoken');

 const SignUp = require('../models/signup');

 const authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        console.log(token);
        const signup = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log("signupID",signup.signupId);
        SignUp.findByPk(signup.signupId)
        .then(signup=>{
            req.signup = signup;
            next();
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false});
    }
 }
 

 module.exports = {authenticate};