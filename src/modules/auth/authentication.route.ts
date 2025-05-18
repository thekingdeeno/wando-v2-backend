import { container } from "tsyringe";
import AuthenticationController from "./authentication.controller"
import fastify, { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";

const authenticationController = container.resolve(AuthenticationController);

const authenticationRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.POST,
        url: '/login',
        handler: authenticationController.login
    })

    fastify.route({
        method: METHODS.POST,
        url: '/otp-login',
        handler: authenticationController.loginFromOtp
    })
};

export default authenticationRoute;