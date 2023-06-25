
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const URL = sequelize.define('url',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    url:Sequelize.STRING,
});


module.exports = URL;