const pool = require('../config/connection.js');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

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

        const token = jwt.sign ({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_SECRET, {expiresIn: "5d"});
        res.cookie("token", token, {httpOnly: true});
        res.cookie("refreshToken", refreshToken, {httpOnly: true, path: "/auth/refresh", maxAge: 5 * 24 * 60 * 60 * 1000});
        return res.json({message: "loggin was successfull", token: token, refreshToken: refreshToken});
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const newToken = (req,res) => {
    let refreshToken;
    if (req.cookies.refreshToken) {
         refreshToken = req.cookies.refreshToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
         const authHeaders = req.headers.authorization;
         refreshToken = authHeaders.split(" ")[1];
    }

    if (!refreshToken) { return res.status(401).json({ message: "Authentication required"}); };
    try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const token = jwt.sign({id: decoded.id, role: decoded.role}, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.cookie("token", token, { httpOnly: true });
    return res.json({message: "new access token is created", token: token});
    } catch (error) {
        return res.status(401).json({message: "expired or invalid token"});
    }
    
}

const updateUserStatus = async (req,res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const allowedStatuses = ['active', 'pending', 'suspended'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status'});
        } 
        const update = `UPDATE users SET status = $1 WHERE id = $2`;
        const result = await pool.query(update,[status]);
        if (result.rowCount > 0) {
            return res.status(200).json({message: "record updated successfully"});
        } else {
            return res.status(404).json({message: "user not found"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUsers = async (req,res) => {
    try {
        const select  = `SELECT * FROM users ORDER BY id`;
        const result = await pool.query(select);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserById = async (req,res) => {
    try {
        const id = req.params.id;
        const select = `SELECT * FROM users WHERE id = $1`;
        const result = await pool.query(select, [id]);
        if (result.rows.length > 0) {
           return res.status(200).json(result.rows);
        } else {
           return res.status(404).json({message: "user not found"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, updateUserStatus, loggin, getUsers, getUserById };