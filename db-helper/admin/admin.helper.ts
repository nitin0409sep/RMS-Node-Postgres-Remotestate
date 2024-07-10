import { pool } from "../../db-config/db-connection"
import { User } from "../../utils/users.interface";

// GET ALL SUB-ADMINS 
export const getAllSubAdminsData = async () => {
    try {
        const query = 'SELECT * FROM users WHERE $1 = ANY(user_roles)';
        const values = [2];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            let data: User[] = result.rows;
            return data;
        }

        return [];
    } catch (error) {
        throw error;
    }

}