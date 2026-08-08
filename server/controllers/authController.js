import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { validateEmail, validatePassword, validateName } from '../utils/validation.js';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!validateName(name)) {
            return errorResponse(res, 400, 'Name must be between 2 and 100 characters');
        }
        if (!validateEmail(email)) {
            return errorResponse(res, 400, 'Please provide a valid email address');
        }
        if (!validatePassword(password)) {
            return errorResponse(res, 400, 'Password must be at least 6 characters');
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return errorResponse(res, 409, 'An account with this email already exists');
        }

        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash: password, // will be hashed by pre-save hook
        });

        await user.save();
        const token = generateToken(user._id);

        return successResponse(res, 201, 'Account created successfully', {
            token,
            user: user.toJSON(),
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, 'Please provide email and password');
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        const token = generateToken(user._id);

        return successResponse(res, 200, 'Login successful', {
            token,
            user: user.toJSON(),
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
    try {
        return successResponse(res, 200, 'User fetched successfully', {
            user: req.user.toJSON(),
        });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
    // JWT is stateless; logout is handled client-side by removing the token
    return successResponse(res, 200, 'Logged out successfully');
};
