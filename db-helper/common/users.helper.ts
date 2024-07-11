import { pool } from '../../db-config/db-connection';
import bcrypt from 'bcrypt';
import { User } from '../../utils/users.interface';

// CREATE USER
export const createUser = async (user_name: string, user_email: string, user_password: string, created_by: number | null, user_roles: number[], created_by_user_id: string) => {
    // Hash Password
    user_password = await bcrypt.hash(user_password, 10);

    const query = `INSERT INTO USERS(user_name, user_email, user_password, created_by, user_roles, created_by_user_id)
                   VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [user_name, user_email, user_password, created_by, user_roles, created_by_user_id];

    try {
        const create_user = await pool.query(query, values);

        // Check if the insertion was successful
        return create_user.rows.length > 0 ? create_user.rows[0] : false;
    } catch (err) {
        throw err;
    }
}

// GET All USERS
export const getAllUsers = async (user_id?: string) => {
    try {
        let query = 'Select * from users where $1 = ANY(user_roles)'; // Admin wants to see the list of users
        let values: any = [3];

        if (user_id) { // Subadmin wants to see the list of users
            query = 'SELECT * FROM users WHERE created_by_user_id = $1 AND $2 = ANY(user_roles)';
            values = [user_id, 3];
        }

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            let data: User[] = result.rows;
            return data;
        }

        return [];
    } catch (err) {
        throw err;
    }
}

// CHECK USER ALREADY EXISTS OR NOT 
export const checkUserExists = async (email: string, role_id?: number) => {
    const query = `SELECT * FROM users WHERE user_email = $1`;
    try {
        const userExists = await pool.query(query, [email]);
        const role_exist = {
            isUserCrearted: false,
            isEmailExists: false,
        };

        if (userExists.rows.length > 0) {
            const roleExsits = userExists.rows[0].user_roles.includes(role_id);

            if (!roleExsits && role_id) {
                const query = `UPDATE Users SET user_roles = array_append(user_roles::integer[], $1) WHERE user_email = $2;`;
                const values = [role_id, email];

                try {
                    await pool.query(query, values);
                    role_exist.isUserCrearted = true;
                } catch (err) {
                    role_exist.isUserCrearted = false;
                }
            }

            role_exist.isEmailExists = true;
        }

        return role_exist;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

// GET SPECIFIC USER
export const getUser = async (user_id: string) => {
    try {
        const query = 'Select user_roles from users where user_id = $1';
        const values = [user_id];

        const result = await pool.query(query, values);

        return result.rows.length > 0 ? result.rows[0] : false;
    } catch (err) {
        throw err;
    }
}
