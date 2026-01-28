import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { HealthRecord } from '../models/HealthRecord.js';
import * as geminiService from '../services/geminiService.js';

export const getHealthRecords = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { petId } = req.params;

        const records = await HealthRecord.find({ userId, petId }).sort({ date: -1 });

        res.json({ records });
    } catch (error) {
        console.error('Get health records error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addVaccination = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { petId } = req.params;
        const { title, vaccineType, date, nextDueDate, veterinarian, clinic, notes } = req.body;

        const record = new HealthRecord({
            userId,
            petId,
            type: 'vaccination',
            title,
            vaccineType,
            date: date || new Date(),
            nextDueDate,
            veterinarian,
            clinic,
            notes,
        });

        await record.save();

        res.status(201).json({
            message: 'Vaccination record added successfully',
            record,
        });
    } catch (error) {
        console.error('Add vaccination error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const analyzeMedicine = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { image } = req.body;

        if (!image) {
            res.status(400).json({ error: 'Image data is required' });
            return;
        }

        const base64Image = image.replace(/^data:image\/[a-z]+;base64,/, '');

        const result = await geminiService.analyzeMedicine(base64Image);

        res.json({ result });
    } catch (error) {
        console.error('Medicine analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze medicine' });
    }
};

export const analyzeHealthVideo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { video } = req.body;

        if (!video) {
            res.status(400).json({ error: 'Video data is required' });
            return;
        }

        const base64Video = video.replace(/^data:video\/[a-z0-9]+;base64,/, '');

        const result = await geminiService.analyzeHealthVideo(base64Video);

        res.json({ analysis: result });
    } catch (error) {
        console.error('Health video analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze health video' });
    }
};

export const findNearbyVets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            res.status(400).json({ error: 'Location (lat, lng) is required' });
            return;
        }

        const result = await geminiService.findNearbyVets({ lat, lng });

        res.json(result);
    } catch (error) {
        console.error('Find vets error:', error);
        res.status(500).json({ error: 'Failed to find nearby vets' });
    }
};
