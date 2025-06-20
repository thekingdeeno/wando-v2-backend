import { BaseRepository } from "./base.repository";
import { Chat, ChatModel, ChatI, ChatPartialType } from "../model/chat";

class ChatRepository extends BaseRepository <Chat, ChatI> {
    constructor(){
        super(ChatModel)
    };

    async createPrivateChat(userIds: readonly[string, string]){
        return await new ChatModel({type: 'private', members: userIds}).save()
    };

    async createGroupChat(payload: ChatPartialType){
        return await new ChatModel(payload).save();
    };

    async createPublicChat(payload: ChatPartialType){
        return await new ChatModel(payload).save();
    };

    async findChatById(chatId: string){
        return await ChatModel.findOne({chatId}, {'messages': 0});
    };


    // async createPublicThread

    async fetchUserMessages(userId: string, page = 1, limit = 15){
        const skipValue = (limit * page) - limit
        return await ChatModel.aggregate([
            {
                $match: {members: {$in: userId}}
            },
            {
                $sort: {
                    updatedAt: - 1
                }
            },
            {
                $skip: skipValue
            },
            {
                $limit: limit
            }
        ])

        return await ChatModel.find({members: {$in : [userId]}}).sort({updatedAt: -1}).skip(skipValue).limit(limit)
    }

    async fetchChatMessages(chatId: string, page: number = 1, limit: number = 25){
        const skipValue = (limit * page) - limit
        return (await ChatModel.findOne({chatId}, {messages: {$slice: [skipValue*1, limit*1]}})).messages
    };

    async newMessage(chatId: string, userId: string, text: string, read: boolean, replyId?: string){
        return await ChatModel.updateOne({chatId}, {$push:{
            messages: {userId, text, read, replyId}
        }});
    }; 

};

export default ChatRepository