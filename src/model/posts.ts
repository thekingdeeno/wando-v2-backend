import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';
import { CommentType } from '../shared/types/post.comment.type';

export interface Post {
    userId: string,
    title: string,
    text: string,
    image: string,
    tags: string,
    likes: string[],
    comments: CommentType[],
    shares: number,
    createdAt: Date,
}

interface PostI extends Post, Document {}

const PostSchema = new Schema({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
    },
    title: {type: String},
    text: {type: String},
    image: {type: String},
    tags: {type: [String]}, // or [String]
    likes: [{
            type: SchemaTypes.ObjectId,
            ref: 'User',            
    }],
    comments: [{
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
        username: String,
        content: String,
        likes: Number,
    }],
    createdAt: {
        type: Date,
        default: ()=> Date.now(),
        immutable: true,
    },
    
});

const PostModel: Model<PostI> = model<PostI>('post', PostSchema);

export default PostModel;