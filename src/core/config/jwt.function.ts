import jwt from 'jsonwebtoken';
import { envs } from './env';
//import sendError from '../constants/errors';

//definition of interface to be used as payload
// interface UserPayload {
//     name: string;
//     email: string;
//     password: string;
// }

const tokenOps = {
    generateAccessToken: (payload): string => {
        return jwt.sign(payload, envs.JWT_ACCESS_TOKEN as string, { expiresIn: '30m' });
    },
    generateRefreshToken: (payload): string => {
        return jwt.sign(payload, envs.JWT_ACCESS_TOKEN as string, {expiresIn: '30d' });
    },
    verifyAccessToken: (token: string) => {
        return jwt.verify(token, envs.JWT_ACCESS_TOKEN as string)
    },
}
export default tokenOps;