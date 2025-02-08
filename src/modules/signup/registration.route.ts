import { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import RegistrationController from "./registration.controller";
import { container } from "tsyringe";

const registrationController = container.resolve(RegistrationController)

const registrationRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.POST,
        url: '/signup',
        handler: registrationController.registerUser
    })
}

export { registrationRoute }