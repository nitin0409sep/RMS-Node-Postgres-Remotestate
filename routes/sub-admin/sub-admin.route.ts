import { Router } from "express";
import { createUserBySubAdmin, getAllUsersCreatedBySubadmin } from "../../controllers/sub-admin/sub-admin.controller";
import { createRestaurants, getAllRestaurants } from '../../controllers/common/restaurant.controller';
import { createDish, getAllDish } from '../../controllers/common/dish.controller';
import { authenticateSubadmin, authenticateUser } from "../../middlewares/authorization.auth.middleware";

export const subAdminRoute = Router();

// CREATE USER (User) BY SUB ADMIN
subAdminRoute.post('/createUser', [authenticateUser, authenticateSubadmin], createUserBySubAdmin);

// VIEW ALL USERS CREATED BY SUB ADMIN
subAdminRoute.get('/getAllUsers', [authenticateUser, authenticateSubadmin], getAllUsersCreatedBySubadmin);

// CREATE RESTAURANT BY SUB ADMIN
subAdminRoute.post('/createRestaurant', [authenticateUser, authenticateSubadmin], createRestaurants)

// GET ALL RESTAURANT'S CREATED BY SUB ADMIN
subAdminRoute.get('/getAllRestaurant', [authenticateUser, authenticateSubadmin], getAllRestaurants)

// CREATE DISHES BY SUB ADMIN
subAdminRoute.post('/createDish', [authenticateUser, authenticateSubadmin], createDish);

// GET ALL DISHES CREATED BY SUB ADMIN
subAdminRoute.get('/getAllDishes', [authenticateUser, authenticateSubadmin], getAllDish);