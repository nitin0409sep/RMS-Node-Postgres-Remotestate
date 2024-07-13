import e, { Response } from 'express';
import { ExtendedRequest } from '../../utils/users.interface';
import { createRestaurant, getAllRestaurant } from '../../db-helper/common/restaurant.helper';
import { getUser } from '../../db-helper/common/users.helper';

// CREATE RESTAURANT 
export const createRestaurants = async (req: ExtendedRequest, res: Response) => {
    try {
        const { restaurant_name, restaurant_address_name, longitude, latitude } = req.body;

        // Missing Requires Fields
        if (!restaurant_name || !restaurant_address_name || !longitude || !latitude) {
            const missingFields: string[] = [];
            if (!restaurant_name) missingFields.push('restaurant_name');
            if (!restaurant_address_name) missingFields.push('restaurant_address_name');
            if (!longitude) missingFields.push('longitude');
            if (!latitude) missingFields.push('latitude');

            return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
        }

        // Created_By
        const user_id = req.user?.user_id;

        if (!user_id) return res.status(401).json({ error: "Unauthorized User" });

        const result = await createRestaurant(user_id!, restaurant_name, restaurant_address_name, longitude, latitude);

        if (result)
            return res.status(200).json({ message: "Restaurant Created Successfully.", error: null, status: 'Ok' });

        return res.status(400).json({ error: "Restaurant could not be added due to a server error." });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL RESTAURANT 
export const getAllRestaurants = async (req: ExtendedRequest, res: Response) => {
    try {

        let user_id: string | undefined | null = req.user?.user_id;

        // Check whether user is admin or subadmin or user
        const userRole = await getUser(user_id!);

        if (!userRole.includes(1, 3))
            user_id = null;

        const getRestaurantData: any[] | [] = await getAllRestaurant(user_id);

        if (getRestaurantData.length > 0) {
            const restaurantData = getRestaurantData.map(val => val.restaurant_name);

            // Successfully Fetched All Sub Admins 
            return res.status(200).json({ data: { restaurant_name: restaurantData }, error: null, status: 'Ok' });
        }

        // Error While Fetching All Sub Admins
        return res.status(200).json({ data: [], error: null, status: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}
