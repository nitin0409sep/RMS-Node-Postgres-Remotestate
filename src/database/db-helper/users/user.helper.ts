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

// GET USER ADDRESS
export const getUserAddress = async (user_id: string) => {
    try {
        const query = `Select * from addresses where user_id = $1`;
        const values = [user_id];
        const { rows } = await pool.query(query, values);

        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        throw err;
    }
}


// GET DISTANCE FROM 1 ADDRESS TO OTHER
export const getDistanceAddress = async (user_id: string, restaurantLatitude: number, restaurantLongitude: number) => {
    try {
        const userAdd = await getUserAddress(user_id);

        // USER ADDRESS NOT FOUND
        if (!userAdd)
            return false;

        // GET DISTANCE
        const getDistance = distance(userAdd.latitude, userAdd.longitude, restaurantLatitude, restaurantLongitude);

        return getDistance ? Math.round(getDistance * 100) / 100 : false;
    } catch (err) {
        throw err;
    }
}

// GET DISTANCE B/W 2 LATITUDE AND 2 LONGITUDE
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const r = 6371; // R is the Earth's radius (mean radius = 6,371 km)
    const p = Math.PI / 180;

    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
        + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
        (1 - Math.cos((lon2 - lon1) * p)) / 2;

    return 2 * r * Math.asin(Math.sqrt(a));
}