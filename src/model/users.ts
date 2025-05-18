import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';
import { bycryptHashString } from '../shared/utils/hash.utils';
import { genUUID } from '../shared/utils/generate.utils';
import { UserRepository } from '../repositories/user.repository';

export interface User {
    userId: string,
    reference: string,
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
    isVerified: boolean,
    isOperational: boolean,
    createdAt: Date,
    updatedAt: Date,
};

export interface UserI extends User, Document {}

const UserSchema = new Schema ({
    userId: {type: String},
    userReference: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true, unique: true},
    username: {type: String, required: false, unique: true},
    dateOfBirth: {type: Date, immutable: true},
    password: String,
    avatar: String,
    bio: String,
    link: String,
    googleId: {type: String},
    facebookId: {type: String},
    twitterId: {type: String},
    instagramId: {type: String},
    githubId: {type: String},
    friends: [{type: SchemaTypes.ObjectId, ref: 'User'}],
    following:[{type: SchemaTypes.ObjectId, ref: 'User'}],
    followers: [{type: SchemaTypes.ObjectId, ref: 'User'}],
    posts: [{type: SchemaTypes.ObjectId, ref: 'Posts'}],
    chats: [{type: SchemaTypes.ObjectId, ref: 'Chat'}],
    isVerified: {type: Boolean, default: false},
    isOperational: {type: Boolean, default: false},
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true},
    updatedAt: {type: Date, default: ()=> Date.now()},
});

UserSchema.pre('save', async function(){
    this.password = await bycryptHashString(this.password);
    this.userReference = genUUID();
    this.firstName = this.firstName.toLowerCase();
    this.lastName = this.lastName.toLowerCase();
    this.email = this.email.toLowerCase();
    this.userId = this._id.toString()
});

export const UserModel: Model<UserI> = model<UserI>("users", UserSchema);


export interface UserPartialType extends Partial<User> {};