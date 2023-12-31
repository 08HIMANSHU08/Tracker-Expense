
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({

    url:{
    type:String,
    required:true
   },
   signupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
   }
});

module.exports = mongoose.model('Url',urlSchema);
