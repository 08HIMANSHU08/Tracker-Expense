const SignUp = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

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
    const t = await sequelize.transaction();
    try{
        const email= req.body.email;
        const passward = req.body.passward;
        if(isStringEmpty(email)||isStringEmpty(passward)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const users = await SignUp.findAll({where:{email}},{transaction:t});
        if(users.length>0){
            bcrypt.compare(passward,users[0].passward,(err,result)=>{
                if(err){
                    throw new Error("Something Went Wrong");
                }
                if(result===true){
                    res.status(200).json({success:true,message:"Login Successfull",token:generateAccessToken(users[0].id,users[0].name,users[0].ispremiumuser)});
                }else{
                    res.status(401).json({success:false,message:"Passward Is Incorrect"});
                }
            }) 
        }else{
            res.status(404).json({success:false,message:"User Not Found"});
        }  
        await t.commit();
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false,message:err})
    }
}