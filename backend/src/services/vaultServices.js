import pool from "../config/db.js";

async function createVaultEntry(userId, vaultEntryData, ip, userAgent){
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const {
            service_name, 
            encrypted_username, 
            encrypted_password, 
            iv, 
            notes, 
            tags
        } = vaultEntryData;

        await connection.execute(
            `INSERT INTO vault_entries
            (user_id, service_name, encrypted_username, encrypted_password, iv, notes, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, 
                service_name, 
                encrypted_username, 
                encrypted_password, 
                Buffer.from(iv, 'hex'), 
                notes, 
                tags ? JSON.stringify(tags) : null 
            ]
        );

        const [userRows] = await connection.execute(
            `SELECT email FROM users WHERE id = ?`,
            [userId]
        );

        if (!userRows.length) {
            throw new Error('User not found');
        }

        const email = userRows[0].email;

        await connection.execute(
            `INSERT INTO activity_logs
            (user_id, action_type, target, ip_address, user_agent)
            VALUES (?, 'create_entry', ?, ?, ?)`,
            [userId, `Created entry for ${service_name}`, ip, userAgent]
        );

        await connection.commit();
        return {success: true};
    } catch (error) {
        await connection.rollback();
        console.error('Error creating vault entry:', error);
        return {success: false, message: error.message || "Failed to create vault entry"};
    } finally {
        connection.release();
    }
}

async function updateVaultEntry(userId, vaultEntryData, ip, userAgent) {
    try {
        const {
            entry_id,
            service_name,
            encrypted_username,
            encrypted_password,
            iv,
            notes,
            tags
        } = vaultEntryData;

        if (!entry_id) {
            return { success: false, message: 'Entry ID is required for update' };
        }

        const [existingRows] = await pool.execute(
            `SELECT id, service_name FROM vault_entries WHERE id = ? AND user_id = ?`,
            [entry_id, userId]
        );
    
        if (!existingRows.length) {
            return { success: false, message: 'Vault entry not found or unauthorized.' };
        }
    
        const fields = [];
        const values = [];
    
        if (service_name !== undefined) {
            fields.push("service_name = ?");
            values.push(service_name);
        }
        if (encrypted_username !== undefined) {
            fields.push("encrypted_username = ?");
            values.push(encrypted_username);
        }
        if (encrypted_password !== undefined) {
            fields.push("encrypted_password = ?");
            values.push(encrypted_password);
        }
        if (iv !== undefined) {
            fields.push("iv = ?");
            values.push(Buffer.from(iv, 'hex'));
        }
        if (notes !== undefined) {
            fields.push("notes = ?");
            values.push(notes);
        }
        if (tags !== undefined) {
            fields.push("tags = ?");
            values.push(JSON.stringify(tags));
        }
    
        if (!fields.length) {
            return { success: false, message: "No valid fields provided for update." };
        }
        
        await pool.execute(
            `UPDATE vault_entries SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
            [...values, entry_id, userId]
        );
    
        await pool.execute(
            `INSERT INTO activity_logs
             (user_id, action_type, target, ip_address, user_agent)
             VALUES (?, 'update_entry', ?, ?, ?)`,
            [userId, service_name || existingRows[0].service_name, ip, userAgent]
        );
    
        return { success: true };
    
    } catch (error) {
        console.error('Error updating vault entry:', error);
        return { success: false, message: error.message || "Failed to update vault entry" };
    }
}

async function softDeleteVaultEntry(userId, entryId, ip, userAgent) {
    try {
      const [existingRows] = await pool.execute(
        `SELECT service_name FROM vault_entries WHERE id = ? AND user_id = ? AND is_active = TRUE`,
        [entryId, userId]
      );
  
      if (!existingRows.length) {
        return { success: false, message: "Entry not found or already deleted." };
      }
  
      const serviceName = existingRows[0].service_name;
  
      await pool.execute(
        `UPDATE vault_entries SET is_active = FALSE, deleted_at = NOW() WHERE id = ? AND user_id = ?`,
        [entryId, userId]
      );
  
      await pool.execute(
        `INSERT INTO activity_logs
         (user_id, action_type, target, ip_address, user_agent)
         VALUES (?, 'delete_entry', ?, ?, ?)`,
        [userId, serviceName, ip, userAgent]
      );
  
      return { success: true };
    } catch (error) {
      console.error("Vault soft delete error:", error);
      return { success: false, message: "Failed to delete vault entry." };
    }
  }

async function listVaultEntries(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT 
            id, 
            service_name, 
            encrypted_username, 
            encrypted_password, 
            iv, 
            notes, 
            tags,
            created_at,
            updated_at
         FROM vault_entries
         WHERE user_id = ? AND is_active = TRUE
         ORDER BY updated_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error("Vault list error:", error);
      return [];
    }
  }

export {
        createVaultEntry, 
        updateVaultEntry,
        softDeleteVaultEntry,
        listVaultEntries,
    };
