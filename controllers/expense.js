
const Expense = require('../models/expensetable');
const SignUp = require('../models/signup');
const AWS = require('aws-sdk');
const UrlTable = require('../models/urltable');

function uploadToS3(data,filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
    })
        var params = {
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read',
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params, (err,s3response)=>{
                if(err){
                    console.log("something went worng",err)
                    reject(err);
                }else{
                    resolve(s3response.Location);
                }
            })
        })  
}


exports.downloadExpense = async (req,res,next)=>{
    try{
        const signupId = req.signup._id;
        
        const expenses = await Expense.find({signupId:signupId});
        
        const stringifiedExpense = JSON.stringify(expenses);
       
        const filename = `Expense${signupId}/${new Date}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpense,filename);
        
        const urltable = new UrlTable({url:fileUrl,signupId:signupId});
        urltable.save();
        
        const getUrls = await UrlTable.find({signupId:signupId});
        
        res.status(200).json({fileUrl,success:true,urls:getUrls})
    }catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'',success:false,err:err})
    }
}

exports.getExpense = async(req,res,next)=>{
    try{
        const page =Number (req.params.page);
        const rows =Number(req.params.rows);
       
        let totaItems = await Expense.find({signupId:req.signup._id});
       
        const users = await Expense.find({signupId:req.signup._id})
         res.status(200).json({
            allExpense:users,
            currentPage:page,hasNextPage:(rows*page)<(users.length),
            nextPage:(page+1),
            hasPreviousPage:(page>1),
            previousPage:(page-1),
            lastPage:(Math.ceil((users.length)/rows)),
            success:true
        });
    }catch(err){
        console.log('get user is failed',JSON.stringify(err))
        res.status(500).json({error:err,success:false})
    }
}

exports.postExpense = async(req,res,next)=>{
    try{
        const expense = req.body.exp;
        const category = req.body.cat;
        const description = req.body.desc;
        if(expense==undefined||expense.length===0){
            return res.status(400).json({success:false,message:"Amount is Mandatory"});
        }
        const newExpense = new Expense({amount:expense,description:description,category:category,signupId:req.signup});
        newExpense.save();
        const totalexp = Number(req.signup.totalexpense) + Number(expense);
        await SignUp.findByIdAndUpdate({_id:req.signup._id},{totalexpense:totalexp});
        res.status(201).json({newExpense:[newExpense]});
    }catch(err){
        res.status(500).json({success:false,error:err})
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        if(req.params.id == 'undefined'){
            console.log("ID is Missing");
            return res.status(400).json({success:false,message:"ID is Missing"})
        }
        const userId = req.params.id;
       
        const expdata = await Expense.find({_id:userId});
        
        const totalexp = req.signup.totalexpense - expdata[0].amount;
        
        await SignUp.findByIdAndUpdate({_id:req.signup._id},{totalexpense:totalexp});
       
        await Expense.findByIdAndRemove(userId);
        res.status(200).json({success:true,message:"Deletion Done"})
    }
    catch(err){
        res.status(500).json({success:false,error:err})
    }
}


