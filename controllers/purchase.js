
const RazorPay = require('razorpay');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

function generateAccessToken(id,name,ispremiumuser){
    console.log("purchase",id,name,ispremiumuser)
    return jwt.sign({signupId:id,name:name,ispremiumuser},process.env.TOKEN_SECRET);
}

exports.getPurchase = async(req,res,next)=>{
    try{
        var raz = new RazorPay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET,
        })
        const amount = 25000;
        raz.orders.create({amount,currency:'INR'},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            Order.create({orderid:order.id,status:"PENDING",signupId:req.signup.id})
            .then(()=>{
                return res.status(201).json({order,key_id:raz.key_id});
            })
            .catch(err=>{console.log(err)})
        })
    }catch(err){
        console.log(err);
        res.status(403).json({message:'Something Went Wrong',error:err});
    }
}

exports.postPurchase = async(req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const signupid = req.signup.id;
        const {payment_id,order_id}=req.body;
        const order=await Order.findOne({where:{orderid:order_id}});
        const promise1 = order.update({paymentid:payment_id,status:"SUCCESSFULL",signupId:req.signup.id});
        const promise2 = req.signup.update({ispremiumuser:true})
        Promise.all([promise1,promise2])
        .then(()=>{
            return res.status(202).json({success:true,message:"Transaction Successful",token:generateAccessToken(signupid,undefined,true)});
        })
        .catch((err)=>{
            console.log(err);
            return res.status(403).json({success:false,message:"transaction failed"});
        })
        await t.commit();
    }
    catch(err){
        await t.rollback();
        console.log(err);
        res.status(403).json({success:false,message:"Something Went Wrong"});
    }
}