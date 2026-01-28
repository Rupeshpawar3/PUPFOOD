import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    petId?: mongoose.Types.ObjectId;
    content: string;
    images?: string[];
    likes: mongoose.Types.ObjectId[];
    likesCount: number;
    commentsCount: number;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        petId: {
            type: Schema.Types.ObjectId,
            ref: 'Pet',
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        images: [
            {
                type: String,
            },
        ],
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
