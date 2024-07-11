import { pool } from '../../db-config/db-connection';
import bcrypt from 'bcrypt';

// LOGIN USER
export const loginToUser = async (user_email: string, user_password: string) => {
    try {
        const query = 'Select * from users where user_email = $1'
        const { rows } = await pool.query(query, [user_email]);

        // Validate Password
        const validPassword = await bcrypt.compare(user_password, rows[0].user_password);
        return validPassword ? rows[0] : false;
    } catch (err) {
        throw err;
    }
}