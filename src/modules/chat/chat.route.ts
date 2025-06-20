import { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import ChatController from "./chat.controller";
import { container } from "tsyringe";
import authMiddleware from "../../shared/middlewares/auth.middleware";

const chatController = container.resolve(ChatController)

const chatRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.GET,
        url: '/private-chat/',
        handler: chatController.createPrivateChat,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/fetch-chats',
        handler: chatController.fetchUserMessages,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/fetch-messages/:chatId',
        handler: chatController.fetchChatMesssges,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.POST,
        url: '/new-message/:chatId',
        handler: chatController.newMessage,
        preHandler: [authMiddleware]
    });
};

export default chatRoute;