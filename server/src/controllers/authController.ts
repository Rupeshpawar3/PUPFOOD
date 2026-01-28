import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const generateToken = (userId: string, email: string): string => {
    return jwt.sign({ id: userId, email }, config.jwtSecret, {
        expiresIn: '7d',
    });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password, name, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
            phone,
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id.toString(), user.email);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.email);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { googleId, email, name, profileImage } = req.body;

        if (!googleId || !email || !name) {
            res.status(400).json({ error: 'Missing required Google auth data' });
            return;
        }

        // Find or create user
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            // Create new user with Google OAuth
            user = new User({
                googleId,
                email,
                name,
                profileImage,
            });
            await user.save();
        } else if (!user.googleId && user.email === email) {
            // Link existing email account with Google
            user.googleId = googleId;
            if (profileImage) user.profileImage = profileImage;
            await user.save();
        }

        // Generate token
        const token = generateToken(user._id.toString(), user.email);

        res.json({
            message: 'Google authentication successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Server error during Google authentication' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
