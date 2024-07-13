import { Response } from 'express';
import { ExtendedRequest } from '../../utils/users.interface';
import validator from 'validator'; // Validator
import { createRestaurant, getAllRestaurant } from '../../db-helper/common/restaurant.helper';
import { createDishes, getAllDishes } from '../../db-helper/common/dishes.helper';
import { addAddress, checkUserValidRole } from '../../db-helper/users/user.helper';

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