import { pool } from '../../db-config/db-connection';

// CREATE RESTAURANT
export const createDishes = async (created_by: string, dish_name: string, restaurant_id: string) => {
    try {
        const query = 'Insert into dishes(created_by, dish_name, restaurant_id) Values($1, $2, $3) Returning *';
        const values = [created_by, dish_name, restaurant_id];

        const { rows } = await pool.query(query, values);

        return rows?.length > 0 ? rows[0] : false;
    } catch (err) {
        throw err;
    }
}

// GET ALL RESTAURANT
export const getAllDishes = async (created_by?: string) => {
    try {
        let query = 'SELECT dish_name FROM dishes';

        if (created_by)
            query = `SELECT dish_name FROM dishes where created_by = '${created_by}'`

        const { rows } = await pool.query(query);

        return rows?.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    }
} 