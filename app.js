const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productRouts = require('./routs/productroutes');

app.use('/product', productRouts);

app.listen(6008,() => {
    console.log("server running on port 6008");
});