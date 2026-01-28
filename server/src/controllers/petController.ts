import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Pet } from '../models/Pet.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAllPets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const pets = await Pet.find({ userId }).sort({ createdAt: -1 });
        res.json({ pets });
    } catch (error) {
        console.error('Get pets error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getPetById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const pet = await Pet.findOne({ _id: id, userId });
        if (!pet) {
            res.status(404).json({ error: 'Pet not found' });
            return;
        }

        res.json({ pet });
    } catch (error) {
        console.error('Get pet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const createPet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userId = req.userId;
        const { name, age, gender, breed, weight, color, image, thumb } = req.body;

        const pet = new Pet({
            userId,
            name,
            age,
            gender,
            breed,
            weight,
            color,
            image: image || '',
            thumb: thumb || '',
        });

        await pet.save();

        res.status(201).json({
            message: 'Pet created successfully',
            pet,
        });
    } catch (error) {
        console.error('Create pet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updatePet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { name, age, gender, breed, weight, color, image, thumb } = req.body;

        const pet = await Pet.findOne({ _id: id, userId });
        if (!pet) {
            res.status(404).json({ error: 'Pet not found' });
            return;
        }

        // Update fields
        if (name) pet.name = name;
        if (age) pet.age = age;
        if (gender) pet.gender = gender;
        if (breed) pet.breed = breed;
        if (weight) pet.weight = weight;
        if (color) pet.color = color;
        if (image !== undefined) pet.image = image;
        if (thumb !== undefined) pet.thumb = thumb;

        await pet.save();

        res.json({
            message: 'Pet updated successfully',
            pet,
        });
    } catch (error) {
        console.error('Update pet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deletePet = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const pet = await Pet.findOneAndDelete({ _id: id, userId });
        if (!pet) {
            res.status(404).json({ error: 'Pet not found' });
            return;
        }

        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Delete pet error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
