import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import * as geminiService from '../services/geminiService.js';

export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { message, history } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        const response = await geminiService.chatWithBot(message, history || []);

        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Chat service unavailable' });
    }
};

export const textToSpeech = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { text } = req.body;

        if (!text) {
            res.status(400).json({ error: 'Text is required' });
            return;
        }

        const audioData = await geminiService.generateSpeech(text);

        if (!audioData) {
            res.status(500).json({ error: 'Failed to generate speech' });
            return;
        }

        res.json({ audioData });
    } catch (error) {
        console.error('TTS error:', error);
        res.status(500).json({ error: 'Text-to-speech service unavailable' });
    }
};

export const transcribeAudio = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { audio } = req.body;

        if (!audio) {
            res.status(400).json({ error: 'Audio data is required' });
            return;
        }

        const base64Audio = audio.replace(/^data:audio\/[a-z0-9]+;base64,/, '');

        const transcription = await geminiService.transcribeAudio(base64Audio);

        res.json({ transcription });
    } catch (error) {
        console.error('Transcription error:', error);
        res.status(500).json({ error: 'Transcription service unavailable' });
    }
};

export const thinkingQuery = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { query } = req.body;

        if (!query) {
            res.status(400).json({ error: 'Query is required' });
            return;
        }

        const response = await geminiService.askThinkingAI(query);

        res.json({ response });
    } catch (error) {
        console.error('Thinking AI error:', error);
        res.status(500).json({ error: 'Thinking AI service unavailable' });
    }
};
