import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';
import { CommentType } from '../shared/types/general.type';
export interface Post {
    userId: string,
    quoteId: string,
    postId: string,
    title: string,
    text: string,
    mediaUrls: string[],
    hashtags: string[],
    tags: string[],
    likes: string[],
    comments: CommentType[],
    saves: string[],
    shares: string[],
    reposts: string[],
    status: 'draft' | 'published' | 'deleted' | 'archived',
    visibility: 'public' | 'private' | 'followers' | 'custom',
    location?: {
        latitude: number,
        longitude: number,
        name?: string
    },
    contentWarning?: string,
    engagementMetrics?: {
        viewCount: number,
        likeCount: number,
        commentCount: number,
        shareCount: number
    },
    createdAt: Date,
    updatedAt: Date
}

export interface PostI extends Post, Document {}

const PostSchema = new Schema({
    postId:{type: String},
    quoteId: {type: String}, // this is the post ID for the post being quoted
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    title: {type: String},
    text: {type: String},
    mediaUrls: [{type: String}],
    hashtags: {type: [String]},
    tags: {type: [String]},
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
        text: String,
        likes: Number,
    }],
    saves: [{
            type: SchemaTypes.ObjectId,
            ref: 'User',        
    }],
    shares: [{
            type: SchemaTypes.ObjectId,
            ref: 'User',        
    }],
    reposts: [{
            type: SchemaTypes.ObjectId,
            ref: 'User',        
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'deleted', 'archived'],
        default: 'published'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'followers', 'custom'],
        default: 'public'
    },
    location: {
        latitude: Number,
        longitude: Number,
        name: String
    },
    contentWarning: String,
    engagementMetrics: {
        viewCount: {type: Number, default: 0},
        likeCount: {type: Number, default: 0},
        commentCount: {type: Number, default: 0},
        shareCount: {type: Number, default: 0}
    },
    createdAt: {
        type: Date,
        default: ()=> Date.now(),
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: ()=> Date.now(),
    },
});

PostSchema.pre('save', async function(){
    this.postId = this._id.toString()
});

export const PostModel: Model<PostI> = model<PostI>('post', PostSchema);

export interface PostPartialType extends Partial<Post> {};