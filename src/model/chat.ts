import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';
import { ChatType } from '../shared/types/general.type';
import { MessageType } from '../shared/types/general.type';

export interface Chat {
    type: ChatType;
    members: string[];
    messages: MessageType;
    createdAt: Date
}

interface ChatI extends Chat, Document {}

const ChatSchema = new Schema({
    type: {type: String},
    members: [{
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
    }],
    messages: [{
        authorId: {
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

const ChatModel: Model<ChatI> = model<ChatI>('Chat', ChatSchema);

export default ChatModel;