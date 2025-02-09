import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';

export interface User {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    username: string,
    dateOfBirth: Date,
    password: string,

    avatar: string,
    bio: string,
    link: string,

    googleId: string,
    facebookId: String,
    twitterId: string,
    instagramId: string,
    githubId: string,


    friends: string[],
    following: string[],
    followers: string[],
    posts: string[],
    chats: string[],

    createdAt: Date
    updatedAt: Date,
};

interface UserI extends User, Document {}


const UserSchema = new Schema ({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    dateOfBirth: {
        type: Date,
        // default: ()=> Date.now(),
        // immutable: true,
    },
    password: String,

    avatar: String,
    bio: String,
    link: String,

    googleId: {type: String, unique: true},
    facebookId: {type: String, unique: true},
    twitterId: {type: String, unique: true},
    instagramId: {type: String, unique: true},
    githubId: {type: String, unique: true},

    friends: [{
        type: SchemaTypes.ObjectId,
        ref: 'User',
    }],
    following:[{
        type: SchemaTypes.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: SchemaTypes.ObjectId,
        ref: 'User'
    }],

    posts: [{
        type: SchemaTypes.ObjectId,
        ref: 'Posts',
    }],
    chats: [{
        type: SchemaTypes.ObjectId,
        ref: 'Chat'
    }],

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

const UserModel: Model<UserI> = model<UserI>("users", UserSchema)

export default UserModel;