import { createUserByAdmin, getAllSubAdmins, getAllUsersByAdmin } from "../../controllers/admin/admin.controller";
import { Router } from "express";

export const adminRoute = Router();

// CREATE USER (Sub-Admin, User)
adminRoute.post('/createUser', createUserByAdmin);

// LIST ALL SUB ADMIN'S
adminRoute.get('/getAllSubAdmin', getAllSubAdmins);

// GET ALL USERS
adminRoute.get('/getAllUsers', getAllUsersByAdmin);