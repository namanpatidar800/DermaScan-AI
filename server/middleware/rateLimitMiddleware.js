import rateLimit from 'express-rate-limit';

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const analysisRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30,
    message: {
        success: false,
        message: 'Analysis limit reached. Please try again in an hour.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
