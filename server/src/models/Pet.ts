import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    age: string;
    gender: string;
    breed: string;
    weight: string;
    color: string;
    image: string;
    thumb: string;
    createdAt: Date;
    updatedAt: Date;
}

const petSchema = new Schema<IPet>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female'],
        },
        breed: {
            type: String,
            required: true,
            trim: true,
        },
        weight: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        thumb: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
petSchema.index({ userId: 1 });

export const Pet = mongoose.model<IPet>('Pet', petSchema);
