import { container } from "tsyringe";
import { FastifyPluginAsync } from "fastify";
import { METHODS } from "../../shared/enums/route.merthod.enum";
import TestController from "./test.controller";

const testController = container.resolve(TestController);

const testRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: METHODS.GET,
        url: '/test',
        handler: testController.test
    })
}

export default testRoute