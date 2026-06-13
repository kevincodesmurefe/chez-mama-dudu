const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const HELLO = "pass";
console.log(`Hello ${process.env.HELLO}`);
app.listen(6008,() => {
    console.log("server running on port 6008");
});