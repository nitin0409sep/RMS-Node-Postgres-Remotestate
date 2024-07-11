import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ExtendedRequest } from '../utils/users.interface';
import { getUser } from '../db-helper/common/users.helper';

// Authenticate User Login or Not
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']; // Bearer Token
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token is NULL' });

    verify(token, process.env.ACCESS_TOKEN_SECRET ?? '', ((err: any, user: any) => {
        if (err) return res.status(403).json({ error: err.message });

        (req as ExtendedRequest).user = user;
        next();
    }));
}

// Authenticate Admin
export const authenticateAdmin = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req?.user?.user_id;
        if (!user_id) return res.status(401).json({ error: 'Unauthorized User' });

        const { user_roles } = await getUser(user_id);

        if (!user_roles || !user_roles.includes(1)) return res.status(401).json({ error: 'Unauthorized User' });
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized User" });
    }

    next();
}

// Authenticate Subadmin
export const authenticateSubadmin = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const user_id = req?.user?.user_id;
        if (!user_id) return res.status(401).json({ error: 'Unauthorized User' });

        const { user_roles } = await getUser(user_id);

        if (!user_roles || !user_roles.includes(2)) return res.status(401).json({ error: 'Unauthorized User' });
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized User" });
    }

    next();
}
