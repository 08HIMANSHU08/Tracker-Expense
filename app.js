
const path = require('path');

const express = require('express');
var cors = require('cors');

const fs = require('fs');

require('dotenv').config();

const sequelize=require('./util/database');

const morgan = require('morgan');

const SignUp = require('./models/signup');
const Expense = require('./models/expensetable');
const ForgotPassward = require('./models/forgetpasswardrequest');
const urlModels = require('./models/urltable');

const adminRoutes = require('./routes/admin');
const expenseRoutes = require('./routes/expenseapp');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumfeature');
const passwardRoutes = require('./routes/forgotpassward');

const Order = require('./models/order');

const app = express();

app.use(cors());

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flag:'a'}
);


app.use(morgan('combined',{stream:accessLogStream}));
app.use(express.json());

app.use('/user',adminRoutes)
app.use('/expense',expenseRoutes);

app.use('/purchase',purchaseRoutes);

app.use('/premium',premiumFeatureRoutes);

app.use('/password',passwardRoutes);

app.use((req,res)=>{
    console.log(req.url);
    res.sendFile(path.join(__dirname,`${req.url}`));
})

SignUp.hasMany(Expense);
Expense.belongsTo(SignUp);

SignUp.hasMany(Order);
Order.belongsTo(SignUp);

SignUp.hasMany(ForgotPassward);
ForgotPassward.belongsTo(SignUp);

SignUp.hasMany(urlModels);
urlModels.belongsTo(SignUp);

sequelize.sync()
.then(()=>{
    console.log(process.env.PORT)
    app.listen(process.env.PORT||3000)
})
.catch(err=>{console.log(err)});
