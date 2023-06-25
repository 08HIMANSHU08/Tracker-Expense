
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ForgotPassward = sequelize.define('forgotpasswardrequest',{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
    },
    isactive:Sequelize.BOOLEAN,
})

module.exports = ForgotPassward;