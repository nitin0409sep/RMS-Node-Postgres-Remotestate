import { pool } from '../../db-config/db-connection';
import bcrypt from 'bcrypt';
import { User } from '../../utils/users.interface';

// Create User
export const createUser = async (user_name: string, user_email: string, user_password: string, created_by: number, user_roles: number[]) => {
    // Hash Password
    user_password = await bcrypt.hash(user_password, 10);

    const query = `INSERT INTO USERS(user_name, user_email, user_password, created_by, user_roles)
                   VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const values = [user_name, user_email, user_password, created_by, user_roles];

    try {
        const create_user = await pool.query(query, values);

        // Check if the insertion was successful
        return create_user.rows.length > 0 ? create_user.rows[0] : false;
    } catch (err) {
        throw err;
    }
}

// GET All USERS
export const getAllUsers = async (role_id: number, user_id?: string) => {
    try {
        let query = 'Select * from users where $1 = ANY(user_roles)'; // Admin wants to see the list of users

        if (role_id === 2) // Subadmin wants to see the list of users
            query = 'Select * from users where $1 = ANY(user_roles) && user_id = $2';

        const values = [3];

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

// Check user already exists or not
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

            if (!roleExsits) {
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
