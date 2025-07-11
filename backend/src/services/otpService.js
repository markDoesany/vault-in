import pool from "../config/db.js";
import crypto from "crypto";
import { sendOTPEmail } from "./mailService.js";

async function generateAndSendOTP(userId, email) {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    
    await pool.execute(
        `INSERT INTO otp_logs (user_id, email, otp_code, status) 
         VALUES (?, ?, ?, 'sent')`,
        [userId, email, otpCode]
    )

    await sendOTPEmail({to: email, otp: otpCode});

    return otpCode;
}

async function verifyOTP(userId, enteredOTP){
    const [rows] = await pool.execute(
        `SELECT otp_code, timestamp FROM otp_logs
         WHERE user_id = ? AND status = 'sent'
         ORDER BY timestamp DESC
         LIMIT 1`,
        [userId]
    );
    
    if (!rows.length) return {success: false, message: 'No OTP found'};

    const {otp_code, timestamp } = rows[0];
    const now = new Date();
    const sentTime = new Date(timestamp)

    const fiveMinutes = 5 * 60 * 1000;
    const isExpired = now - sentTime > fiveMinutes;

    if (isExpired) {
        await pool.execute(
            `UPDATE otp_logs
             SET status = 'expired'
             WHERE user_id = ? AND otp_code = ?
             ORDER BY timestamp DESC LIMIT 1`,
            [userId, otp_code]
        )
        return {success: false, message: "OTP has expired"}
    }
    
    if (String(enteredOTP) !== String(otp_code)) {
        await pool.execute(
            `UPDATE otp_logs
             SET status = 'failed'
             WHERE user_id = ? AND otp_code = ?
             ORDER BY timestamp DESC LIMIT 1`,
            [userId, otp_code]
        )
        return {success: false, message: "Invalid OTP"}
    }
    
    await pool.execute(
        `UPDATE otp_logs
         SET status = 'verified'
         WHERE user_id = ? AND otp_code = ?
         ORDER BY timestamp DESC LIMIT 1`,
        [userId, otp_code]
    )

    await pool.execute(
        `UPDATE users
         SET is_verified = 1
         WHERE id = ?`,
        [userId]
    )
    return {success: true, message: "User verified successfully"}
}

export{
    generateAndSendOTP,
    verifyOTP,
}