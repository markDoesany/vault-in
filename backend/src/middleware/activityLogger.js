import pool from '../config/db.js';

export function createActivityLogger(action_type, target = '') {
  return async function logActivity(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) return next();

      const ip = req.ip || req.headers['x-forwarded-for'];
      const userAgent = req.headers['user-agent'];

      await pool.execute(
        `INSERT INTO activity_logs
         (user_id, action_type, target, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, action_type, target, ip, userAgent]
      );
    } catch (err) {
      console.error('Failed to log activity:', err);
    }
    next();
  };
}