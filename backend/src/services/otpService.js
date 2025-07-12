import pool from "../config/db.js";
import crypto from "crypto";
import { sendOTPEmail } from "./mailService.js";

async function generateAndSendOTP(userId, type, email) {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    
    await pool.execute(
        `INSERT INTO otp_logs (user_id, email, otp_code, type, status) 
         VALUES (?, ?, ?, ?, 'sent')`,
        [userId, email, otpCode, type]
    )

    await sendOTPEmail({to: email, subject: `Your Vault-In ${type.charAt(0).toUpperCase() + type.slice(1)} Code`, otp: otpCode});

    return otpCode;
}

async function verifyOTP(userId, type, enteredOTP){
    const [otpRecord] = await pool.execute(
        `SELECT otp_code, timestamp, status FROM otp_logs
         WHERE user_id = ? AND type = ?
         ORDER BY timestamp DESC
         LIMIT 1`,
        [userId, type]
    );
    
    if (!otpRecord.length) {
        return {success: false, message: 'No OTP found for this operation'};
    }
    const {otp_code, timestamp, status } = otpRecord[0];
    const now = new Date();
    const sentTime = new Date(timestamp);

    if (status === 'verified') {
        return {success: false, message: 'This OTP has already been used. Please request a new one.'};
    }
    
    if (status === 'expired' || status === 'failed') {
        return {success: false, message: 'This OTP is no longer valid. Please request a new one.'};
    }

    const fiveMinutes = 5 * 60 * 1000;
    const isExpired = now - sentTime > fiveMinutes;

    if (isExpired) {
        await pool.execute(
            `UPDATE otp_logs
             SET status = 'expired'
             WHERE user_id = ? AND otp_code = ? AND type = ?
             ORDER BY timestamp DESC LIMIT 1`,
            [userId, otp_code, type]
        );
        return {success: false, message: 'This OTP has expired. Please request a new one.'};
    }

    if (otp_code !== enteredOTP) {
        await pool.execute(
            `UPDATE otp_logs
             SET status = 'failed'
             WHERE user_id = ? AND otp_code = ? AND type = ?
             ORDER BY timestamp DESC LIMIT 1`,
            [userId, otp_code, type]
        );
        return {success: false, message: 'Invalid OTP code. Please try again.'};
    }

    await pool.execute(
        `UPDATE otp_logs
         SET status = 'verified'
         WHERE user_id = ? AND otp_code = ? AND type = ?
         ORDER BY timestamp DESC LIMIT 1`,
        [userId, otp_code, type]
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