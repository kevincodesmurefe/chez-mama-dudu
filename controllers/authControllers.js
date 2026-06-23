const pool = require('../db/connection.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async(req,res) => {
    try {
        
    
    const { name, user_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const insert = `INSERT INTO users (name, user_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(insert,[name, user_name, email, hashedPassword]);
    return res.json({message: "user created", user: result.rows[0]});
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
}

const loggin = async(req,res) => {
    try {
        
    
    const {identifier, password} = req.body;
    const select = `SELECT * FROM users WHERE user_name = $1 or email = $1`;
    const result = await pool.query(select,[identifier]);

    if (!result.rows.length > 0) {
        return res.status(404).json({message: "user not found"});
    }
    
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = jwt.sign ({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});
        return res.json({token});
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}