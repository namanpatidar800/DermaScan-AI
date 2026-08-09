import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { generalRateLimit } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Security middlewares
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Body parsers (Multer handles multi-part image streaming separately)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General rate limiting
app.use('/api', generalRateLimit);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SKINOVA API is running',
        environment: process.env.NODE_ENV,
        aiProvider: process.env.AI_PROVIDER || 'mock',
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
