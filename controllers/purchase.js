
const RazorPay = require('razorpay');
const SignUp = require('../models/signup')
const Order = require('../models/order');
const jwt = require('jsonwebtoken');


function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({signupId:id,name:name,ispremiumuser},process.env.TOKEN_SECRET);
}

exports.getPurchase = async(req,res,next)=>{
    try{
        var raz = new RazorPay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET,
        })
        const amount = 25000;
        raz.orders.create({amount,currency:'INR'},(err,norder)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            const order = new Order({paymentid:"PENDING",orderid:norder.id,status:"PENDING",signupId:req.signup._id})
            order.save()
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
    try{
        const signupid = req.signup.id;
     
        const {payment_id,order_id,id}=req.body;
        await Order.findByIdAndUpdate({_id:id},{paymentid:payment_id,orderid:order_id,status:"SUCCESSFULL",signupId:req.signup._id});
        await SignUp.findByIdAndUpdate({_id:req.signup._id},{isPremium:true})
            return res.status(202).json({success:true,message:"Transaction Successful",token:generateAccessToken(signupid,undefined,true)});
    }
    catch(err){
        console.log(err);
        res.status(403).json({success:false,message:"transaction failed"});
    }
}