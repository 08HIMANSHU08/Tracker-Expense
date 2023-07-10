const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const signupSchema = new Schema({

    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    totalexpense:{
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('User',signupSchema);