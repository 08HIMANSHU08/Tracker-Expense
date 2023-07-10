
const path = require('path');

const express = require('express');
var cors = require('cors');

const fs = require('fs');

require('dotenv').config();

const mongoose = require('mongoose');

const morgan = require('morgan');

const adminRoutes = require('./routes/admin');
const expenseRoutes = require('./routes/expenseapp');
const purchaseRoutes = require('.//routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumfeature');
const passwardRoutes = require('./routes/forgotpassward');

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

mongoose.connect(process.env.MONGODB_KEY)
.then(result=>{
    console.log("Connected to port")
    app.listen(PORT);
})
.catch(err=>{console.log(err)})