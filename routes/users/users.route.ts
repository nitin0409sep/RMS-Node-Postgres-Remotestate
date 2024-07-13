import { Router } from "express";
import { authenticateUser } from "../../middlewares/authorization.auth.middleware";
import {
    createRestaurantByUser,
    getAllRestaurantCreatedByUser,
    createDishesByUser,
    getAllDishesOfUser,
    addAddressOfUser
} from '../../controllers/users/user.controller';
export const userRoute = Router();

// CREATE RESTAURANT BY USER
userRoute.post('/createRestaurant', [authenticateUser], createRestaurantByUser)

// GET ALL RESTAURANT'S CREATED BY USER
userRoute.get('/getAllRestaurant', [authenticateUser], getAllRestaurantCreatedByUser)

// CREATE DISHES BY USER
userRoute.post('/createDish', [authenticateUser], createDishesByUser);

// GET ALL DISHES CREATED BY USER
userRoute.get('/getAllDishes', [authenticateUser], getAllDishesOfUser);

// ADD USER ADDRESS
userRoute.post('/addAddress', [authenticateUser], addAddressOfUser);