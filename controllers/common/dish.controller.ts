import { Response } from 'express';
import { ExtendedRequest } from '../../utils/users.interface';
import { createDishes, getAllDishes } from '../../db-helper/common/dishes.helper';
import { getUser } from '../../db-helper/common/users.helper';

// CREATE DISH 
export const createDish = async (req: ExtendedRequest, res: Response) => {
    try {
        const { dish_name, restaurant_id } = req.body;

        // restaurant_name Given or Not
        if (!dish_name || !restaurant_id)
            return res.status(400).json({ error: `Please provide required fields i.e Dish Name and Restaurant Id}` });

        // Created_By
        const user_id = req.user?.user_id;

        if (!user_id) return res.status(401).json({ error: "Unauthorized User" });

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
export const getAllDish = async (req: ExtendedRequest, res: Response) => {
    try {
        const { restaurant_id } = req.body;

        if (!restaurant_id)
            return res.status(400).json({ error: `Please provide required fields i.e Restaurant Id}` });

        let user_id: string | undefined | null = req.user?.user_id;

        // Check whether user is admin or subadmin or user
        const userRole = await getUser(user_id!);

        if (!userRole.includes(1, 3))
            user_id = null;

        const getDishesData: any[] | [] = await getAllDishes(restaurant_id, user_id);

        if (getDishesData.length > 0) {
            const dishes_data = getDishesData.map(val => val.dish_name);

            // Successfully Fetched All Dishes Created By Sub Admins 
            return res.status(200).json({ data: { dishes_name: dishes_data }, error: null, status: 'Ok' });
        }

        // Error While Fetching All Dishes Created By Sub Admins
        return res.status(200).json({ data: [], error: null, status: 'Ok' });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
}