import { container } from "tsyringe";
import UserController from "./user.controller";
import { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import authMiddleware from "../../shared/middlewares/auth.middleware";
import multipathMiddleware from "../../shared/middlewares/multipath.middleware";


const userController = container.resolve(UserController);

const userRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.GET,
        url: '/',
        preHandler: [authMiddleware],
        handler: userController.fetchUserById
    })
    fastify.route({
        method: METHODS.PUT,
        url: '/update/:userId',
        preHandler: [authMiddleware],
        handler: userController.updateUser
    });
        fastify.route({
        method: METHODS.POST,
        url: '/update-pfp/:userId',
        preHandler: [authMiddleware, multipathMiddleware],
        handler: userController.uploadPfp
    })
    fastify.route({
        method: METHODS.GET,
        url: '/followers/:userId',
        preHandler: [authMiddleware],
        handler: userController.fetchFollowers
    })
    fastify.route({
        method: METHODS.GET,
        url: '/following/:userId',
        preHandler: [authMiddleware],
        handler: userController.fetchFollowing
    })
    fastify.route({
        method: METHODS.PUT,
        url: '/follow-user/:userId',
        preHandler: [authMiddleware],
        handler: userController.followUser
    })
}

export default userRoute;