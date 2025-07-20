import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export async function sessionGuard(req, res, next){
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({ error: "No token provided"});
    }
    const tokenPart = authHeader.split(' ')[1];
    const token = tokenPart.startsWith('SessionToken=')
    ? tokenPart.split('SessionToken=')[1]
    : tokenPart;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.execute(
            `SELECT * from user_sessions WHERE user_id = ? AND token = ? AND expires_at > NOW()`,
            [decoded.userId, token]
        )

        if (!rows.length){
            return res.status(403).json({ error: 'Session expired or invalid'})
        }

        req.user = { id: decoded.userId, email: decoded.email};
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token'})
    }
}