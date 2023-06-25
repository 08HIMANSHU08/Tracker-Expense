
const ForgotPassward = require('../models/forgetpasswardrequest');
const SignUp = require('../models/signup');
const bcrypt = require('bcrypt');

exports.getResetpassward = async(req,res,next)=>{
    try{
        const uuid = req.params.uuid;
        const user= await ForgotPassward.findByPk(uuid);
        if(user.id==uuid &&user.isactive==true){
            await ForgotPassward.update({isactive: false},{where:{id:uuid}});
                res.status(200).send(`<html>
                                            <script>
                                                function formsubmitted(e){
                                                    e.preventDefault();
                                                    console.log('called')
                                                }
                                            </script>

                                            <form action="/password/updatepassword/${uuid}" method="get">
                                                <label for="newpassword">Enter New password</label>
                                                <input name="newpassword" type="password" required></input>
                                                <button>reset password</button>
                                            </form>
                                        </html>`
                                        )
                                res.end()
            }
        }
        catch{
            console.log("Err");
        }
}

exports.updatePassward = async(req, res,next) => {

        try {
            const { newpassword } = req.query;
            const { resetpasswordid } = req.params;
            const forgot = await ForgotPassward.findByPk(resetpasswordid);
            const signup = await SignUp.findByPk(forgot.signupId)
            if(signup){
            const saltRounds = 10;
                bcrypt.hash(newpassword, saltRounds, async function(err, hash){
                await SignUp.update({ passward: hash },{where:{id:signup.id}})
                    res.status(201).json({message: 'Successfuly update the new password'})
                })
            } 
            else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
        }catch(error){
            return res.status(403).json({ error, success: false } )
        }

}
