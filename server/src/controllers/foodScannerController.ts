import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as geminiService from '../services/geminiService.js';

export const analyzeFood = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { image } = req.body;

        if (!image) {
            res.status(400).json({ error: 'Image data is required' });
            return;
        }

        // Remove data URL prefix if present
        const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');

        const result = await geminiService.analyzeFoodImage(base64Image);

        res.json({ result });
    } catch (error) {
        console.error('Food analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze food image' });
    }
};

export const identifyDog = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { image } = req.body;

        if (!image) {
            res.status(400).json({ error: 'Image data is required' });
            return;
        }

        const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');

        const result = await geminiService.identifyDogProfile(base64Image);

        res.json({ result });
    } catch (error) {
        console.error('Dog identification error:', error);
        res.status(500).json({ error: 'Failed to identify dog' });
    }
};
