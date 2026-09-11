import { container } from "tsyringe";
import { FastifyPluginAsync } from "fastify";
import UploadController from "./upload.controller";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import authMiddleware from "../../shared/middlewares/auth.middleware";

const uploadController = container.resolve(UploadController);

const uploadRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.POST,
        url: '/request-upload-token',
        preHandler: [authMiddleware],
        handler: uploadController.requestUploadToken
    });
}

export default uploadRoute

