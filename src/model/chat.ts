import mongoose from 'mongoose';
const { Schema, SchemaTypes, model } = mongoose;

const chatSchema = new Schema({
    type: String,
    users: [{
        userName: String,
        userId: {
            type: SchemaTypes.ObjectId,
            ref: 'User',
        },
    }],
    messages: [{
        authorName: String,
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
    

});

const Chat = model('Chat', chatSchema);
export default Chat;