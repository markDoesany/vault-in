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

    await pool.execute(
        `UPDATE otp_logs
            SET status = 'used'
            WHERE user_id = ? AND otp_code = ? AND type = ?
            ORDER BY timestamp DESC LIMIT 1`,
        [user.id, otp, 'login']
    )
    
    return {success: true, token: token, aesKey: aesKey.toString("hex")};
}

async function requestPasswordReset(email, ip, userAgent) {
  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (!rows.length) {
    return { success: false, message: 'No account found with that email.' };
  }

  const userId = rows[0].id;

  await generateAndSendOTP(userId, 'reset_password', email);

  await pool.execute(
    `INSERT INTO activity_logs
     (user_id, action_type, target, ip_address, user_agent)
     VALUES (?, 'otp_requested', ?, ?, ?)`,
    [userId, email, ip, userAgent]
  );

  return { success: true, userId };
}

async function resetUserPassword(userId, newPassword, ip, userAgent) {
  try {
    const [userRows] = await pool.execute(
      `SELECT password_hash, email FROM users WHERE id = ?`,
      [userId]
    );
    if (!userRows.length) {
      return { success: false, message: 'User not found.' };
    }

    const { password_hash, email } = userRows[0];

    const isSame = await bcrypt.compare(newPassword, password_hash);
    if (isSame) {
      return { success: false, message: 'New password must be different from the old one.' };
    }

    const [otpRows] = await pool.execute(
      `SELECT id FROM otp_logs
       WHERE user_id = ? AND type = 'reset_password' AND status = 'verified'
       ORDER BY timestamp DESC LIMIT 1`,
      [userId]
    );

    if (!otpRows.length) {
      return { success: false, message: 'No verified OTP found. Please verify your reset code first.' };
    }

    const otpId = otpRows[0].id;

    await pool.execute(
      `UPDATE otp_logs
       SET status = 'used'
       WHERE user_id = ? AND id = ? AND type = ?`,
      [userId, otpId, 'reset_password']
    )

    const newSalt = crypto.randomBytes(16).toString("hex");
    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.execute(
      `UPDATE users
       SET password_hash = ?, encryption_salt = ?
       WHERE id = ?`,
      [newPasswordHash, newSalt, userId]
    );

    await pool.execute(
      `DELETE FROM vault_entries WHERE user_id = ?`,
      [userId]
    );

    await pool.execute(
      `DELETE FROM user_sessions WHERE user_id = ?`,
      [userId]
    );

    await pool.execute(
      `INSERT INTO activity_logs
       (user_id, action_type, target, ip_address, user_agent)
       VALUES (?, 'change_password', ?, ?, ?)`,
      [userId, email, ip, userAgent]
    );

    await pool.execute(
      `INSERT INTO activity_logs
       (user_id, action_type, target, ip_address, user_agent)
       VALUES (?, 'delete_entry', 'vault_wipe_due_to_reset', ?, ?)`,
      [userId, ip, userAgent]
    );

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: 'Failed to reset password.' };
  }
}

async function logoutUser(userId, ip, userAgent){
  try {
    await pool.execute(
      `DELETE FROM user_sessions WHERE user_id = ?`,
      [userId]
    );

    const [userRows] = await pool.execute(
      `SELECT email FROM users WHERE id = ?`,
      [userId]
    )

    const email = userRows[0].email;

    await pool.execute(
      `INSERT INTO activity_logs
       (user_id, action_type, target, ip_address, user_agent)
       VALUES (?, 'logout', ?, ?, ?)`,
      [userId, email, ip, userAgent]
    )

    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: 'Failed to logout.' };
  }
}

export {
    registerUser,
    loginStep1,
    loginStep2,
    requestPasswordReset,
    resetUserPassword,
    logoutUser
}