import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthRecord extends Document {
    petId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: 'vaccination' | 'medicine' | 'health_check' | 'vet_visit';
    title: string;
    description: string;
    date: Date;
    nextDueDate?: Date;
    vaccineType?: string;
    medicineName?: string;
    dosage?: string;
    veterinarian?: string;
    clinic?: string;
    notes?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const healthRecordSchema = new Schema<IHealthRecord>(
    {
        petId: {
            type: Schema.Types.ObjectId,
            ref: 'Pet',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['vaccination', 'medicine', 'health_check', 'vet_visit'],
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        nextDueDate: {
            type: Date,
        },
        vaccineType: {
            type: String,
            trim: true,
        },
        medicineName: {
            type: String,
            trim: true,
        },
        dosage: {
            type: String,
            trim: true,
        },
        veterinarian: {
            type: String,
            trim: true,
        },
        clinic: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        attachments: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
healthRecordSchema.index({ petId: 1, date: -1 });
healthRecordSchema.index({ userId: 1 });

export const HealthRecord = mongoose.model<IHealthRecord>('HealthRecord', healthRecordSchema);
