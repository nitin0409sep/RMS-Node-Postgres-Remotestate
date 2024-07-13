import { Response } from 'express';
import { checkUserExists, createUser, getAllUsers } from '../../db-helper/common/users.helper'
import { ExtendedRequest, User } from '../../utils/users.interface';
import { createRestaurant, getAllRestaurant } from '../../db-helper/common/restaurant.helper';
import { createDishes, getAllDishes } from '../../db-helper/common/dishes.helper';
import validator from 'validator'; // Validator

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
        return res.status(500).json({ error: "User could not be added due to a server error." });
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



