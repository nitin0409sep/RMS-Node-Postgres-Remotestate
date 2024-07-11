import { Router } from "express";
import { createUserByAdmin, getAllSubAdmins, getAllUsersByAdmin, createRestaurantByAdmin, getAllRestaurants } from "../../controllers/admin/admin.controller";
import { authenticateUser, authenticateAdmin } from '../../middlewares/authorization.auth.middleware';

export const adminRoute = Router();

// CREATE USER (Sub-Admin, User)
adminRoute.post('/createUser', [authenticateUser, authenticateAdmin], createUserByAdmin);

// LIST ALL SUB ADMIN'S
adminRoute.get('/getAllSubAdmin', [authenticateUser, authenticateAdmin], getAllSubAdmins);

// GET ALL USER'S
adminRoute.get('/getAllUsers', [authenticateUser, authenticateAdmin], getAllUsersByAdmin);

// CREATE RESTAURANT
adminRoute.post('/createRestaurant', [authenticateUser, authenticateAdmin], createRestaurantByAdmin)

// GET ALL RESTAURANT'S
adminRoute.get('/getAllRestaurant', [authenticateUser, authenticateAdmin], getAllRestaurants);