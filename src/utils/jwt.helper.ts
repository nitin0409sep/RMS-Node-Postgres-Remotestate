import { sign } from 'jsonwebtoken';
import { User } from './users.interface';

export const jwtTokens = (user_data: User) => {
    const user = user_data;

    const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET ?? '', { expiresIn: '350h' })
    const refreshToken = sign(user, process.env.REFRESH_TOKEN_SECRET ?? '', { expiresIn: '5m' })

    return { accessToken, refreshToken };
}
