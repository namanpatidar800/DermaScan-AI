/**
 * Input validation utilities
 */

export const validateEmail = (email) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateName = (name) => {
    return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, 1000);
};

export const validateImageType = (mimetype) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowed.includes(mimetype);
};

export const validateImageSize = (size, maxMB = 10) => {
    return size <= maxMB * 1024 * 1024;
};
