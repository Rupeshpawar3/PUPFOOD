import { body, ValidationChain } from 'express-validator';

export const signupValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const petValidation: ValidationChain[] = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Pet name is required'),
    body('age')
        .trim()
        .notEmpty()
        .withMessage('Pet age is required'),
    body('gender')
        .isIn(['Male', 'Female'])
        .withMessage('Gender must be Male or Female'),
    body('breed')
        .trim()
        .notEmpty()
        .withMessage('Breed is required'),
    body('weight')
        .trim()
        .notEmpty()
        .withMessage('Weight is required'),
    body('color')
        .trim()
        .notEmpty()
        .withMessage('Color is required'),
];
