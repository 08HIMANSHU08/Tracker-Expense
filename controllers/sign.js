const SignUp = require('../models/signup');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');

function isStringEmpty(str){
    if(str==undefined||str.length==0){
        return true;
    }else{
        return false;
    }
}

exports.postSignup = async(req,res,next)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.passward;
        const users = await SignUp.find();
        for(let i=0;i<users.length;i++){
            if(users[i].email==email){
                return res.status(400).json({message:"User Already Exist!",success:false});
            }
        }
        if(isStringEmpty(name)||isStringEmpty(email)||isStringEmpty(password)){
            return res.status(400).json({message:"All Fields Are Mandatory",success:false});
        }
        const saltrounds=10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            const newUser = new SignUp({name:name,email,email,password:hash});
            newUser.save();
            res.status(201).json({message:"Successfully created New User",success:true});
        })
        
    }catch(err){
        console.log(err);
        res.status(500).json({message:err,success:false})
    }
}

