
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const forgotpasswordSchema = new Schema({
    _id:{
        type:String,
    },
    isactive: {
        type: Boolean,
        default: true
    },
    signupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }    
},{_id:false});

module.exports = mongoose.model('forgotpassword',forgotpasswordSchema);
