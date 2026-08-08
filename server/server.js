import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        try {
            await connectDB();
        } catch (dbErr) {
            console.warn('⚠️ MongoDB connection failed. Starting server regardless for Phase 1 verification.');
            console.warn(dbErr.message);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 DermaScan AI Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);
            console.log(`🌐 API: http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
