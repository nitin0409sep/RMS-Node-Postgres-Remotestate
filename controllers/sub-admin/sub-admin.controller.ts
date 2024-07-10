import { Request, Response } from 'express';
import { checkUserExists, createUser } from '../../db-helper/common/users.helper'
import { Roles } from '../../utils/roles.interface';
import validator from 'validator'; // Validator

export const createUserBySubAdmin = async (req: Request, res: Response) => {
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

        // Create a new User
        const createUserBySubAdmin = await createUser(user_name, email, password, created_by, [created_by, role_id]);

        if (createUserBySubAdmin) // Successfully Created User
            return res.status(200).json({ message: 'User created successfully', error: null, status: 'Ok' });

        // Error 
        return res.status(500).json({ error: "Failed to create user" });
    } catch (err) {
        // Server Error 
        return res.status(500).json({ error: "Something Went Wrong" });
    }
}