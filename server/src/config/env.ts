import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pupfood',
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Validate required environment variables
if (!config.geminiApiKey) {
    console.warn('⚠️  GEMINI_API_KEY is not set in environment variables');
}

if (config.jwtSecret === 'change-this-secret' && config.nodeEnv === 'production') {
    throw new Error('JWT_SECRET must be set in production environment');
}
