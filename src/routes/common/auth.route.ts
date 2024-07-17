import { Router } from "express";
import { creatAdmin, loginUser, logoutUser } from '../../controllers/common/auth.controller'

export const authenticationRoute = Router();

// LOGIN USER
authenticationRoute.post('/login', loginUser);

// CREATE USER (SUB-ADMIN, USER)
authenticationRoute.post('/createAdmin', creatAdmin);

// Logout User
authenticationRoute.post('/logout', logoutUser)
