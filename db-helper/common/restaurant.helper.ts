import { pool } from '../../db-config/db-connection';

// CREATE RESTAURANT
export const createRestaurant = async (created_by: string, restaurant_name: string) => {
    try {
        const query = 'Insert into restaurants(created_by, restaurant_name) Values($1, $2) Returning *';
        const values = [created_by, restaurant_name];

        const { rows } = await pool.query(query, values);

        return rows?.length > 0 ? rows[0] : false;
    } catch (err) {
        throw err;
    }
}

// GET ALL RESTAURANT
export const getAllRestaurant = async (created_by?: string) => {
    try {
        let query = 'SELECT restaurant_name FROM restaurants';

        if (created_by)
            query = `SELECT restaurant_id ,restaurant_name FROM restaurants where created_by = '${created_by}'`

        const { rows } = await pool.query(query);

        return rows?.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    }
}
