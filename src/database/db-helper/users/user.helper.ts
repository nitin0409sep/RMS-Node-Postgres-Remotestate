import { pool } from "../../db-config/db-connection"

// ADD ADDRESS OF USER
export const addAddress = async (user_id: string, address_name: string, latitude: string, longitude: string) => {
    try {
        const query = 'INSERT INTO ADDRESSES(USER_ID, ADDRESS_NAME, LATITUDE, LONGITUDE) VALUES($1, $2, $3,$4) RETURNING *';
        const values = [user_id, address_name, latitude, longitude];

        const result = await pool.query(query, values);

        return result?.rows.length > 0 ? result.rows[0] : false;
    } catch (err) {
        throw err;
    }
}

// VALID USER OR NOT (ACCORDING TO ROLE)
export const checkUserValidRole = async (user_id: string) => {
    try {
        const query = 'Select * from users where user_id = $1';
        const values = [user_id];

        const checkUserValid = await pool.query(query, values);

        if (!checkUserValid?.rows[0]?.user_roles.includes(3))
            return false;

        return true;
    } catch (err) {
        throw err;
    }
}