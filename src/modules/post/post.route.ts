import fastify, { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import PostController from "./post.controller";
import { container } from "tsyringe";
import authMiddleware from "../../shared/middlewares/auth.middleware";
import multipathMiddleware from "../../shared/middlewares/multipath.middleware";

const postController = container.resolve(PostController);

const postRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.POST,
        url: '/create-post',
        handler: postController.createPost,
        preHandler: [authMiddleware, multipathMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/fetch-post/:postId',
        handler: postController.getPost,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/fetch-posts/:page/:limit',
        handler: postController.getPosts,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/fetch-user-posts/:page/:limit',
        handler: postController.getUserPosts,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.POST,
        url: '/add-comment/:postId',
        handler: postController.addComment,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/fetch-comments/:postId/:page/:limit',
        handler: postController.fetchComments,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.POST,
        url: '/like-post/:postId',
        handler: postController.likePost,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/save/:postId',
        handler: postController.savePost,
        preHandler: [authMiddleware]
    });
    fastify.route({
        method: METHODS.GET,
        url: '/repost/:postId',
        handler: postController.repost,
        preHandler: [authMiddleware]
    });
}

export default postRoute