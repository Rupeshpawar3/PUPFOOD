import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import petRoutes from './routes/petRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

const app = express();

// Connect to database
connectDatabase();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(cors({
    origin: [config.frontendUrl, 'http://localhost:3000'],
    credentials: true,
}));

app.use(express.json({ limit: '50mb' })); // Increased limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limiter to API routes
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'PUPFOOD Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/assistant', assistantRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
    console.log(`💾 MongoDB: ${config.mongoUri}`);
});

export default app;
