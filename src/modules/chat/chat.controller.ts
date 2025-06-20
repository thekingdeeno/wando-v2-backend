import { FastifyReply, FastifyRequest } from "fastify";
import ChatService from "./chat.service";
import { getReq } from "../../shared/utils/request.utils";
import httpStatus  from "http-status";

class ChatController {
    constructor(
        private ChatService: ChatService
    ){}

    createPrivateChat = async (req: FastifyRequest, res: FastifyReply)=>{
        const {userId} = req.params as any;
        const data = await this.ChatService.createPrivateChat(getReq(req, 'userId'), userId);
        return res.status(httpStatus.OK).send(data);
    };

    fetchUserMessages = async (req: FastifyRequest, res: FastifyReply) => {
        const data = await this.ChatService.fetchUserMessages(getReq(req, 'userId'));
        return res.status(httpStatus.OK).send(data);
    };

    fetchChatMesssges = async (req: FastifyRequest, res: FastifyReply) => {
        const {chatId} = req.params as any;
        const {page, limit} = req.query as any
        const data = await this.ChatService.fetchChatMessages(getReq(req, 'userId'), chatId, page, limit); 
        return res.status(httpStatus.OK).send(data);
    };

    newMessage = async (req: FastifyRequest, res: FastifyReply) => {
        const {chatId} = req.params as any;
        const {userId} = getReq(req, 'userId');
        const {text, read, replyId} = req.body as any
        const data = await this.ChatService.newMessage(chatId, userId, text, read, replyId);
        return res.status(httpStatus.OK).send(data);
    };
};

export default ChatController;