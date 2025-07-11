import pool from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";


const SALT_ROUNDS = 10;

async function registerUser({username, email, password}) {
    const encryptionSalt = crypto.randomBytes(16).toString("hex");
    const aesKey = crypto.pbkdf2Sync(password, encryptionSalt, 100000, 32, "sha256");
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `INSERT INTO users (username, email, password_hash, encryption_salt)
                    VALUES (?, ?, ?, ?)`;
    const values = [username, email, passwordHash, encryptionSalt];
    const [result] = await pool.execute(query, values);
    return result.insertId;
}


async function loginUser({email, password, ip, userAgent}){
    const [rows] = await pool.execute(
        `SELECT id, password_hash, is_verified, encryption_salt
         FROM users
         WHERE email = ?`,
        [email]
    )

    if (!rows.length){
        return {success: false, message: "Invalid Credentials or user not found"};
    }

    const user  = rows[0]

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch){
        return {success: false, message: "Invalid Credentials"};
    }

    if (!user.is_verified){
        return {success: false, status: "unverified", userId: user.id, email: user.email};
    }

    const aesKey = crypto.pbkdf2Sync(password, user.encryption_salt, 100000, 32, "sha256");
    const token = jwt.sign(
        {userId: user.id, email},
        process.env.JWT_SECRET,
        {expiresIn: "5m"} //5-minute TTL
    )

    await pool.execute(
        `REPLACE INTO user_sessions (user_id, token, ip_address, user_agent, expires_at)
         VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
         [user.id, token, ip, userAgent]
      );
    
    return {success: true, token: token, aesKey: aesKey.toString("hex")};
}

export {
    registerUser,
    loginUser,
}