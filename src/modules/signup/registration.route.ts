import { container } from "tsyringe";
import { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import RegistrationController from "./registration.controller";

const registrationController = container.resolve(RegistrationController)

const registrationRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.POST,
        url: '/signup',
        handler: registrationController.registerUser
    })
    fastify.route({
        method: METHODS.GET,
        url: '/check-existing',
        handler: registrationController.checkExisting
    })
}

export { registrationRoute };