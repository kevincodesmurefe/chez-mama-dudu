const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const productRoutes = require('./routes/productRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/product', productRoutes);
app.use('/expense', expenseRoutes);
app.use('/loggin', authRoutes);

app.listen(6008,() => {
    console.log("server running on port 6008");
});