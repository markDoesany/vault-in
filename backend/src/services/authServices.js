import pool from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { generateAndSendOTP, verifyOTP } from "./otpService.js";


const SALT_ROUNDS = 10;

async function registerUser({username, email, password}) {
    const encryptionSalt = crypto.randomBytes(16).toString("hex");
    const otpSecret = crypto.randomBytes(32).toString("hex");


    const aesKey = crypto.pbkdf2Sync(password, encryptionSalt, 100000, 32, "sha256");
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const query = `INSERT INTO users (username, email, password_hash, otp_secret, encryption_salt)
                    VALUES (?, ?, ?, ?, ?)`;
    const values = [username, email, passwordHash, otpSecret, encryptionSalt];
    const [result] = await pool.execute(query, values);
    return result.insertId;
}

async function loginStep1({ email, password }) {
    const [rows] = await pool.execute(
      `SELECT id, password_hash, is_verified FROM users WHERE email = ?`,
      [email]
    );
    if (!rows.length) return { success: false, message: 'Invalid credentials.' };
  
    const user = rows[0];
    if (!await bcrypt.compare(password, user.password_hash)) {
      return { success: false, message: 'Invalid credentials.' };
    }
    if (!user.is_verified) {
      return { success: false, status: 'unverified' };
    }
  
    await generateAndSendOTP(user.id, 'login', email);
    return { success: true, status: 'otp_sent' };
  }
  
async function loginStep2({email, password, otp, ip, userAgent}){
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
    const ok = await verifyOTP(user.id, 'login', otp);
    if (!ok.success) {
        return { success: false, message: ok.message };
    }
    console.log("OTP verified");

    const aesKey = crypto.pbkdf2Sync(password, user.encryption_salt, 100000, 32, "sha256");
    const token = jwt.sign(
        {userId: user.id, email},
        process.env.JWT_SECRET,
        {expiresIn: "5m"} 
    )

    await pool.execute(
        `REPLACE INTO user_sessions (user_id, token, ip_address, user_agent, expires_at)
         VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))`,
         [user.id, token, ip, userAgent]
      );
    
    await pool.execute(
        `INSERT INTO activity_logs
         (user_id, action_type, target, ip_address, user_agent)
         VALUES (?, 'login', ?, ?, ?)`,
        [user.id, email, ip, userAgent]
      );
      
    
    return {success: true, token: token, aesKey: aesKey.toString("hex")};
}

export {
    registerUser,
    loginStep1,
    loginStep2,
}