const SignUp = require('../models/signup');
const ForgotPassward = require('../models/forgetpasswardrequest');
const {v4:uuidv4} = require('uuid');

const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
require('dotenv').config();
apiKey.apiKey =process.env.SENDMAIL_KEY;

const uuid = uuidv4();
const tranEmailApi = new Sib.TransactionalEmailsApi();
   
    exports.postForgetPassword = async(req,res,next)=>{
        try{
            const email = req.body.email;
            const users = await SignUp.findAll({where:{email}});
            console.log(users[0].email==email)
            if(users[0].email==email){
                const sender = {
                    email:process.env.EMAIL
                }
                const receivers = [
                    {
                        email:email
                    }
                ]
                await tranEmailApi.sendTransacEmail({
                        sender,
                        to:receivers,
                        subject:'Reset Your Passward',
                        TextContent: `http://localhost:3000/password/resetpassword/${uuid}`
                    })
                    
                await ForgotPassward.create({id:uuid,isactive:true,signupId:users[0].id});
                return res.status(200).json({message:"Clear",success:true});
            }
        }catch(err){
            console.log(err);
            res.status(500).json({message:"Mail not sent",success:false})
        }
    }