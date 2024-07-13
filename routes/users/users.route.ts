import { Router } from "express";
import { authenticateUser } from "../../middlewares/authorization.auth.middleware";
import { addAddressOfUser } from '../../controllers/users/user.controller';
export const userRoute = Router();

// ADD USER ADDRESS
userRoute.post('/addAddress', [authenticateUser], addAddressOfUser);