import { injectable } from "tsyringe";
import ChatRepository from "../../repositories/chat.repository";
// import { ChatPartialType } from "../../model/chat";
import { UserRepository } from "../../repositories/user.repository";

@injectable()
class ChatService {
    constructor(
        private chatRepository: ChatRepository,
        private UserRepository: UserRepository
    ){}

    public async createPrivateChat(userId: string, userId2: string){
        try {
            const user2 = await this.UserRepository.findUserById(userId2);
            if (!user2) throw new Error ("could not find the secondary chat user")
            const newChat = await this.chatRepository.createPrivateChat([userId, userId2])
            return {
                status: true,
                message: 'new chat created successfully',
                data: newChat
            }
        } catch (error) {
            return {
                status: false,
                message: error.message || "Failed to create new private chat"
            };
        };
    };

    public async fetchUserMessages(userId: string, page?: number, limit?: number){
        try {
            const inbox = await this.chatRepository.fetchUserMessages(userId);
            return{
                status: true,
                message: "user inbox fetched successfuly",
                data: inbox
            };
        } catch (error: any) {
            return {
                status: false,
                message: error.message || "Failed to fetch user messages"
            };
        };
    };

    public async fetchChatMessages(userId: string, chatId: string, page?: number, limit?: number){
        try {
            const chat = await this.chatRepository.findChatById(chatId);
            const isMember = chat.members.includes(userId)
            if (!isMember) throw new Error('Unauthaurized user:: Not a member of this chat') 
            const messages = await this.chatRepository.fetchChatMessages(chatId, page, limit);
            return{
                status: true,
                message: "chat messages fetched successfuly",
                data: messages
            };
        } catch (error: any) {
            return {
                status: false,
                message: error.message || "Failed to fetch chat messages"
            };
        };
    };

    public async newMessage(chatId: string, userId: string, text: string, read: boolean, replyId?: string){
        try {
            const {acknowledged, modifiedCount} = await this.chatRepository.newMessage(chatId, userId, text, read, replyId);
            if (!acknowledged|| modifiedCount === 0) throw new Error ("Failed to send message")
            return {
                status: true,
                message: "message sent"
            };
        } catch (error: any) {
            return {
                status: false,
                message: error.message || "Failed to send messages"
            };
        };
    };
};

export default ChatService