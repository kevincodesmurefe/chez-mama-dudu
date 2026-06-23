const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productRouts = require('./routs/productRoutes');
const expenseRutes = require('./routs/expenseRoutes');

app.use('/product', productRouts);
app.use('/expense', expenseRutes);

app.listen(6008,() => {
    console.log("server running on port 6008");
});