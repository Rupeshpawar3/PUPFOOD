import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Post } from '../models/Post.js';

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = parseInt(req.query.skip as string) || 0;

        const posts = await Post.find()
            .populate('userId', 'name profileImage')
            .populate('petId', 'name image')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { content, petId, images, tags } = req.body;

        if (!content || content.trim().length === 0) {
            res.status(400).json({ error: 'Content is required' });
            return;
        }

        const post = new Post({
            userId,
            petId,
            content,
            images: images || [],
            tags: tags || [],
        });

        await post.save();
        await post.populate('userId', 'name profileImage');

        res.status(201).json({
            message: 'Post created successfully',
            post,
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const likePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        const userIdObj = userId as any;
        const likeIndex = post.likes.findIndex(
            (like) => like.toString() === userIdObj
        );

        if (likeIndex > -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
            post.likesCount = post.likes.length;
        } else {
            // Like
            post.likes.push(userIdObj);
            post.likesCount = post.likes.length;
        }

        await post.save();

        res.json({
            message: 'Post like toggled',
            liked: likeIndex === -1,
            likesCount: post.likesCount,
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
