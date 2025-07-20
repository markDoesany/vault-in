import pool from "../config/db.js";

async function getUserActivityLogs(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT
           action_type,
           target,
           ip_address,
           user_agent,
           timestamp
         FROM activity_logs
         WHERE user_id = ?
         ORDER BY timestamp DESC`,
        [userId]
      );
  
      return rows;
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      throw error;
    }
  }

export { getUserActivityLogs };