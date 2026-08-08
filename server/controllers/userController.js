import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/response.js';

// GET /api/users/profile
export const getProfile = async (req, res, next) => {
    try {
        return successResponse(res, 200, 'Profile fetched', { user: req.user.toJSON() });
    } catch (err) {
        next(err);
    }
};

// PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
    try {
        const { name, profileImage } = req.body;
        const updates = {};

        if (name && name.trim().length >= 2) updates.name = name.trim();
        if (profileImage) updates.profileImage = profileImage;

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        return successResponse(res, 200, 'Profile updated', { user: user.toJSON() });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/users/account
export const deleteAccount = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        return successResponse(res, 200, 'Account deleted successfully');
    } catch (err) {
        next(err);
    }
};
