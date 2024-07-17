import { Router } from "express";
import { authenticateUser } from "../../middlewares/authorization.auth.middleware";
import { addAddressOfUser, getDistance } from '../../controllers/users/user.controller';
import { getAllRestaurants } from '../../controllers/common/restaurant.controller';
import { getAllDish } from '../../controllers/common/dish.controller';
export const userRoute = Router();

// GET ALL RESTAURANT'S CREATED BY USER
userRoute.get('/getAllRestaurant', [authenticateUser], getAllRestaurants)

// GET ALL DISHES CREATED BY USER
userRoute.get('/getAllDishes', [authenticateUser], getAllDish);

// ADD USER ADDRESS
userRoute.post('/addAddress', [authenticateUser], addAddressOfUser);

// GET USER ADRESS DISTANCE FROM RESTAURANT ADDRESS 
userRoute.get('/distance', [authenticateUser], getDistance) 