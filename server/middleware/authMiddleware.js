import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/response.js';

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return errorResponse(res, 401, 'Not authorized — no token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(res, 401, 'Not authorized — user not found');
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return errorResponse(res, 401, 'Session expired — please log in again');
        }
        return errorResponse(res, 401, 'Not authorized — invalid token');
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return errorResponse(res, 403, 'Forbidden — admin access required');
    }
    next();
};
