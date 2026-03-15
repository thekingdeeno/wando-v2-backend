import { FastifyPluginAsync } from "fastify";
import { container } from "tsyringe";
import InstitutionController from "./institution.controller";

const institutionController = container.resolve(InstitutionController);
const institutionRoute: FastifyPluginAsync = async (fastify) => {
    fastify.route({
        method: 'GET',
        url: '/fetch-institutions',
        handler: institutionController.fetchInstitutions
    });

    fastify.route({
        method: 'GET',
        url: '/fetch-institution-countries',
        handler: institutionController.fetchInstitutionCountries
    })
}

export default institutionRoute;