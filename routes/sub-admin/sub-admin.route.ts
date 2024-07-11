import { createRestaurantBySubAdmin, createUserBySubAdmin, getAllUsersCreatedBySubadmin } from "../../controllers/sub-admin/sub-admin.controller";
import { Router } from "express";
import { authenticateSubadmin, authenticateUser } from "../../middlewares/authorization.auth.middleware";

export const subAdminRoute = Router();

// CREATE USER (User) BY SUB ADMIN
subAdminRoute.post('/createUser', [authenticateUser, authenticateSubadmin], createUserBySubAdmin);

// VIEW ALL USERS CREATED BY SUB ADMIN
subAdminRoute.get('/getAllUsers', [authenticateUser, authenticateSubadmin], getAllUsersCreatedBySubadmin);

// CREATE RESTAURANT
subAdminRoute.post('/createRestaurant', [authenticateUser, authenticateSubadmin], createRestaurantBySubAdmin)