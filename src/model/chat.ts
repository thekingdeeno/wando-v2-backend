import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';
import { ChatType } from '../shared/types/general.type';
import { MessageType } from '../shared/types/general.type';

export interface Chat {
    chatId: string
    type: ChatType;
    creator: string[];
    members: string[];
    admin: string[];
    messages: MessageType[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatI extends Chat, Document {}

const ChatSchema = new Schema({
    chatId: {type: String},
    type: {type: String},
    creator: {
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
    },
    members: [{
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
    }],
    admin: [{
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
    }],
    messages: [{
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User'
        },
        text: String,
        sentAt: {
            type: Date,
            default: ()=> Date.now(),
            immutable: true,
        },
        read: {
            type: Boolean,
            default: false
        }
    }],
    read: {type: Boolean},
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

ChatSchema.pre('save', async function(){
    this.chatId = this._id.toString();
});

export const ChatModel: Model<ChatI> = model<ChatI>('Chat', ChatSchema);

export interface ChatPartialType extends Partial<Chat> {};