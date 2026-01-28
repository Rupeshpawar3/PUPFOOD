import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            status: 'error',
        });
        return;
    }

    // Log unknown errors
    console.error('❌ Unhandled Error:', err);

    res.status(500).json({
        error: 'Internal server error',
        status: 'error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        error: 'Route not found',
        status: 'error',
    });
};
