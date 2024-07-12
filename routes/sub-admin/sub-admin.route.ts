import { createDishesBySubAdmin, createRestaurantBySubAdmin, createUserBySubAdmin, getAllDishesBySubAdmin, getAllRestaurantCreatedBySubadmin, getAllUsersCreatedBySubadmin } from "../../controllers/sub-admin/sub-admin.controller";
import { Router } from "express";
import { authenticateSubadmin, authenticateUser } from "../../middlewares/authorization.auth.middleware";

export const subAdminRoute = Router();

// CREATE USER (User) BY SUB ADMIN
subAdminRoute.post('/createUser', [authenticateUser, authenticateSubadmin], createUserBySubAdmin);

// VIEW ALL USERS CREATED BY SUB ADMIN
subAdminRoute.get('/getAllUsers', [authenticateUser, authenticateSubadmin], getAllUsersCreatedBySubadmin);

// CREATE RESTAURANT BY SUB ADMIN
subAdminRoute.post('/createRestaurant', [authenticateUser, authenticateSubadmin], createRestaurantBySubAdmin)

// GET ALL RESTAURANT'S CREATED BY SUB ADMIN
subAdminRoute.get('/getAllRestaurant', [authenticateUser, authenticateSubadmin], getAllRestaurantCreatedBySubadmin)

// CREATE DISHES BY SUB ADMIN
subAdminRoute.post('/createDish', [authenticateUser, authenticateSubadmin], createDishesBySubAdmin);

// GET ALL DISHES CREATED BY SUB ADMIN
subAdminRoute.get('/getAllDishes', [authenticateUser, authenticateSubadmin], getAllDishesBySubAdmin);