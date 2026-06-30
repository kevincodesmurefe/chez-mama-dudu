const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req,res,next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            const authHeader = req.headers.authorization;
            token = authHeader.split(" ")[1];
        }
        if (!token) { return res.status(401).json({ message: "Authentication required"}); }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
        
    } catch (error) {
        return res.status(401).json({message: "expired or invalid token"});
    }
}


module.exports = { verifyToken };