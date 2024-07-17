import { ExtendedRequest } from '../../utils/users.interface'
import { Request, Response } from 'express';
import { checkUserExists, createUser } from '../../database/db-helper/common/users.helper';
import { loginToUser } from '../../database/db-helper/common/auth.helper';
import { jwtTokens } from '../../utils/jwt.helper';
import validator from 'validator'; // Validator

// LOGIN USER
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
    }

    // Check if user exists with the provided email
    const isUser = await checkUserExists(email);

    // Error handling for checkUserExists
    if (!isUser.isEmailExists) return res.status(401).json({ error: "Invalid email" });

    // Check if the provided password is valid
    const user = await loginToUser(email, password);

    // Error handling for loginUser
    if (!user) return res.status(401).json({ error: "Invalid Password" });

    // Generate Token
    const tokens = jwtTokens(user);

    // Successful login response
    return res.status(200).json({ message: "User Logged In Successfully!", token: tokens.accessToken, error: null, status: "OK" });
}

// CREATE ADMIN
export const creatAdmin = async (req: ExtendedRequest, res: Response) => {
    try {
        const { user_name, email, password } = req.body;
        const created_by = null;

        // Email and Password Given or Not
        if (!user_name || !email || !password) {
            const missingFields: string[] = [];
            if (!user_name) missingFields.push('user_name');
            if (!email) missingFields.push('email');
            if (!password) missingFields.push('password');

            return res.status(400).json({ error: `Please provide ${missingFields.join(', ')}` });
        }

        // Validate email is correct or not in format
        if (!validator.isEmail(email))
            return res.status(400).json({ error: "Please provide proper email." });


        // Check User Already Exist Or Not
        const userExists = await checkUserExists(email, 1);

        // Checking Role and Email Already Exsist or Not
        if (userExists.isEmailExists && userExists.isUserCrearted)
            return res.status(200).json({ message: 'User created successfully', error: null, status: 'Ok' })
        else if (userExists.isEmailExists)
            return res.status(400).json({ error: "Email Already Exists" });

        // Which is creating the other user
        const created_by_user_id = null;

        // Create a new User
        const createAdmin = await createUser(user_name, email, password, created_by, [1], created_by_user_id!);

        if (createAdmin) {
            // Generate Token
            const tokens = jwtTokens(createAdmin);

            // Successfully Created User
            return res.status(200).json({
                message: "User Created successfully",
                token: tokens.accessToken,
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


export const logoutUser = async (req: Request, res: Response) => { }