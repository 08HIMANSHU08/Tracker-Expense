
const SignUp = require('../models/signup');

exports.getLeaderBoard = async(req,res,next)=>{
    try{
        const userAggregatedExpense = await SignUp.find();
         res.status(200).json(userAggregatedExpense);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

