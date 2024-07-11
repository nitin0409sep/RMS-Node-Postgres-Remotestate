import { Request, Response } from 'express';
import { checkUserExists, createUser, getAllUsers } from '../../db-helper/common/users.helper'
import { getAllSubAdminsData } from '../../db-helper/admin/admin.helper';
import { createRestaurant, getAllRestaurant } from '../../db-helper/common/restaurant.helper';
import { Roles } from '../../utils/roles.interface';
import { User } from '../../utils/users.interface';
import { ExtendedRequest } from '../../utils/users.interface';
import validator from 'validator'; // Validator

// CREATE USER BY ADMIN
export const createUserByAdmin = async (req: ExtendedRequest, res: Response) => {
    try {
        const { user_name, email, password, role } = req.body;
        const created_by = 1;

        // Email and Password Given or Not
        if (!user_name || !email || !password || !role) {
            const missingFields: string[] = [];
            if (!user_name) missingFields.push('user_name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');
            if (!role) missingFields.push('role');

            return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
        }

        if (!validator.isEmail(email))
            return res.status(400).json({ error: "Please provide proper email." });

        // Setting Role Id According to Role
        let role_id: number;
        switch (role) {
            case Roles.SubAdmin:
                role_id = 2;
                break;
            case Roles.User:
                role_id = 3;
                break;
            default:
                role_id = 0;
        }

        // Invalid Role ID
        if (!role_id) return res.status(400).json({ error: "Provide proper role name!" });

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
        const createUserByAdmin = await createUser(user_name, email, password, created_by, [role_id], created_by_user_id!);

        if (createUserByAdmin) {
            // Successfully Created User
            return res.status(200).json({
                message: "User Created successfully",
                error: null,
                status: "ok"
            });
        }

        // Error 
        return res.status(500).json({ error: "Failed to create user" });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL SUB ADMINS
export const getAllSubAdmins = async (req: Request, res: Response) => {
    try {
        // GET SUB ADMINS DATA
        const getSubAdminsData: User[] | [] = await getAllSubAdminsData();

        if (getSubAdminsData.length > 0) {
            const userData = getSubAdminsData.map((val) => {
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
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL USERS
export const getAllUsersByAdmin = async (req: Request, res: Response) => {
    try {
        const role_id = 1;
        const getUsersData: User[] | [] = await getAllUsers();

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
export const createRestaurantByAdmin = async (req: ExtendedRequest, res: Response) => {
    try {
        const { restaurant_name } = req.body;

        // restaurant_name Given or Not
        if (!restaurant_name)
            return res.status(400).json({ error: `Please provide Restaurant Name}` });

        // Created_By
        const user_id = req.user?.user_id;

        if (!user_id) return res.status(401).json({ error: "Unauthorized User" });

        const result = await createRestaurant(user_id!, restaurant_name);

        if (result)
            return res.status(200).json({ message: "Restaurant Created Successfully.", error: null, status: 'Ok' });

        return res.status(400).json({ error: "Restaurant Is Not Created.", status: 'Ok' });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}

// GET ALL RESTAURANT 
export const getAllRestaurants = async (req: ExtendedRequest, res: Response) => {
    try {
        const getRestaurantData: any[] | [] = await getAllRestaurant();

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