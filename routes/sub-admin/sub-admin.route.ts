import { createUserBySubAdmin } from "../../controllers/sub-admin/sub-admin.controller";
import { Router } from "express";

export const subAdminRoute = Router();

// CREATE USER (User)
subAdminRoute.post('/createUser', createUserBySubAdmin);

module.exports = { subAdminRoute } ;