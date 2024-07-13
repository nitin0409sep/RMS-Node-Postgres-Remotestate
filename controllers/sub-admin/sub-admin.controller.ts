import { Response } from 'express';
import { checkUserExists, createUser, getAllUsers } from '../../db-helper/common/users.helper'
import { ExtendedRequest, User } from '../../utils/users.interface';
import validator from 'validator'; // Validator
import { createRestaurant, getAllRestaurant } from '../../db-helper/common/restaurant.helper';
import { createDishes, getAllDishes } from '../../db-helper/common/dishes.helper';

// CREATE USER BY SUB ADMIN
export const createUserBySubAdmin = async (req: ExtendedRequest, res: Response) => {
    try {
        const { user_name, email, password, role } = req.body;
        const created_by = 2;

        // Email and Password Given or Not
        if (!user_name || !email || !password || !role) {
            const missingFields: string[] = [];
            if (!user_name) missingFields.push('user_name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');
            if (!role) missingFields.push('role');

            return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
        }

        // Validate Email
        if (!validator.isEmail(email))
            return res.status(400).json({ error: "Please provide proper email." });

        // Setting Role Id 
        let role_id: number = 3;

        // Check User Already Exist Or Not
        const userExists = await checkUserExists(email, role_id);

        // Checking Role and Email Already Exsist or Not
        if (userExists.isEmailExists && userExists.isUserCrearted)
            return res.status(200).json({ message: 'User created successfully', error: null, status: 'Ok' })
        else if (userExists.isEmailExists)
            return res.status(400).json({ error: "Email Already Exists" });

        // Which is creating the other user
        const created_by_user_id = req?.user?.user_id;

        // Create a new User
        const createUserBySubAdmin = await createUser(user_name, email, password, created_by, [role_id], created_by_user_id!);

        if (createUserBySubAdmin) // Successfully Created User
            return res.status(200).json({ message: 'User created successfully', error: null, status: 'Ok' });

        // Error 
        return res.status(500).json({ error: "Failed to create user" });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL USERS BY PARTICULAR SUB 
export const getAllUsersCreatedBySubadmin = async (req: ExtendedRequest, res: Response) => {
    try {
        const role_id = 2;
        const user_id = req?.user?.user_id;
        const getUsersData: User[] | [] = await getAllUsers(user_id);

        if (getUsersData.length > 0) {
            const userData = getUsersData.map((val) => {
                return {
                    user_name: val.user_name,
                    user_email: val.user_email,
                }
            })

            // Successfully Fetched All Sub Admins 
            return res.status(200).json({ data: userData, error: null, status: 'Ok' });
        }

        // Error While Fetching All Sub Admins
        return res.status(200).json({ data: [], error: null, status: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

// CREATE RESTAURANT 
export const createRestaurantBySubAdmin = async (req: ExtendedRequest, res: Response) => {
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

        return res.status(400).json({ error: "Restaurant Is Not Created.", status: 'Ok' });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL RESTAURANT 
export const getAllRestaurantCreatedBySubadmin = async (req: ExtendedRequest, res: Response) => {
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
export const createDishesBySubAdmin = async (req: ExtendedRequest, res: Response) => {
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

        return res.status(400).json({ error: "Dish Is Not Created.", status: 'Ok' });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL DISHES
export const getAllDishesBySubAdmin = async (req: ExtendedRequest, res: Response) => {
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

