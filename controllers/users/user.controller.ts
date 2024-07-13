import { Response } from 'express';
import { ExtendedRequest } from '../../utils/users.interface';
import validator from 'validator'; // Validator
import { createRestaurant, getAllRestaurant } from '../../db-helper/common/restaurant.helper';
import { createDishes, getAllDishes } from '../../db-helper/common/dishes.helper';
import { addAddress, checkUserValidRole } from '../../db-helper/users/user.helper';

// CREATE RESTAURANT 
export const createRestaurantByUser = async (req: ExtendedRequest, res: Response) => {
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

        return res.status(400).json({ error: "Restaurant could not be added due to a server error.", status: 'Ok' });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL RESTAURANT 
export const getAllRestaurantCreatedByUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const user_id = req?.user?.user_id;
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

// CREATE DISH 
export const createDishesByUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const { dish_name, restaurant_id } = req.body;

        // restaurant_name Given or Not
        if (!dish_name || !restaurant_id)
            return res.status(400).json({ error: `Please provide required fields i.e Dish Name and Restaurant Id}` });

        // Created_By
        const user_id = req.user?.user_id;
        if (!user_id) return res.status(401).json({ error: "Unauthorized User" });

        const validSubRestaurantOfSubadmin = await getAllRestaurant(user_id);
        const exists = validSubRestaurantOfSubadmin.some(restaurant => restaurant.restaurant_id === restaurant_id);

        if (!exists)
            return res.status(401).json({ error: 'Unauthorized to create dish for this restaurant' })

        const result = await createDishes(user_id!, dish_name, restaurant_id);

        if (result)
            return res.status(200).json({ message: "Dish Created Successfully.", error: null, status: 'Ok' });

        return res.status(400).json({ error: "Dish could not be added due to a server error." });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL DISHES
export const getAllDishesOfUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const user_id = req?.user?.user_id;
        const getDishesData: any[] | [] = await getAllDishes(user_id);

        if (getDishesData.length > 0) {
            const dishes_data = getDishesData.map(val => val.dish_name);

            // Successfully Fetched All Sub Admins 
            return res.status(200).json({ data: { dishes_name: dishes_data }, error: null, status: 'Ok' });
        }

        // Error While Fetching All Sub Admins
        return res.status(200).json({ data: [], error: null, status: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

// ADD ADDRESS OF USER
export const addAddressOfUser = async (req: ExtendedRequest, res: Response) => {
    try {
        const { address_name, latitude, longitude } = req.body;

        // Missing Requires Fields
        if (!address_name || !longitude || !latitude) {
            const missingFields: string[] = [];
            if (!address_name) missingFields.push('Adress');
            if (!longitude) missingFields.push('longitude');
            if (!latitude) missingFields.push('latitude');

            return res.status(400).json({ error: `Please provide proper ${missingFields.join(', ')}` });
        }
        const user_id = req.user?.user_id;
        if (!user_id) return res.status(401).json({ error: "Unauthorized User" });

        const isValidUser = await checkUserValidRole(user_id);

        if (!isValidUser)
            return res.status(401).json({ message: "Unauthorized User for Adding Address" });

        const result = await addAddress(user_id!, address_name, latitude, longitude);

        if (!result)
            return res.status(500).json({ error: "Address could not be added due to a server error." });

        return res.status(200).json({ message: "Address added successfully.", error: null, status: 'Ok' })
    } catch (err) {

    }
}