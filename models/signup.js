
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const SignUp = sequelize.define('signup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
    },
    passward:Sequelize.STRING,
    ispremiumuser:Sequelize.BOOLEAN,
    totalexpense:{
        type:Sequelize.INTEGER,
        defaultValue:0,
    }
});


module.exports = SignUp;
