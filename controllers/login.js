const SignUp = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringEmpty(str){
    if(str==undefined||str.length==0){
        return true;
    }else{
        return false;
    }
}

function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({signupId:id,name:name,ispremiumuser},process.env.TOKEN_SECRET);
}

exports.postLogin = async(req,res,next)=>{
    try{
        const email= req.body.email;
        const passward = req.body.passward;
        if(isStringEmpty(email)||isStringEmpty(passward)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const users = await SignUp.findOne({email});
      
        if(users){
            bcrypt.compare(passward,users.password,(err,result)=>{
                if(err){
                    throw new Error("Something Went Wrong");
                }
                if(result===true){
                    res.status(200).json({success:true,message:"Login Successfull",token:generateAccessToken(users._id,users.name,users.isPremium)});
                }else{
                    res.status(401).json({success:false,message:"Passward Is Incorrect"});
                }
            }) 
        }else{
            res.status(404).json({success:false,message:"User Not Found"});
        }  
    }catch(err){
        res.status(500).json({success:false,message:err})
    }
}