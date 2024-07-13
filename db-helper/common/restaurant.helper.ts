import { pool } from '../../db-config/db-connection';

// CREATE RESTAURANT
export const createRestaurant = async (created_by: string, restaurant_name: string, restaurant_address_name: string, longitude: string, latitude: string) => {
    try {
        // Used composite types to store addresses
        const query = `
        INSERT INTO restaurants (created_by, restaurant_name, restaurant_addresses)
        VALUES ($1, $2, ARRAY[
          ROW($3, $4, $5)::address_type
        ]) RETURNING *;
      `;

        const values = [created_by, restaurant_name, restaurant_address_name, longitude, latitude];

        const { rows } = await pool.query(query, values);

        return rows?.length > 0 ? rows[0] : false;
    } catch (err) {
        throw err;
    }
}

// GET ALL RESTAURANT
export const getAllRestaurant = async (created_by: string | null | undefined) => {
    try {
        let query = 'SELECT restaurant_name FROM restaurants'; // For User And Admin

        if (created_by) // For Subadmin
            query = `SELECT restaurant_id, restaurant_name FROM restaurants where created_by = '${created_by}'`

        const { rows } = await pool.query(query);

        return rows?.length > 0 ? rows : [];
    } catch (err) {
        throw err;
    }
}
