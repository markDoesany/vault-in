import pool from "../config/db.js";

export async function testDBConnection() {
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        throw new Error(`Database connection failed: ${error.message}`);
    } finally {
        // Don't close the pool here as we want to keep it open for the application
    }
}