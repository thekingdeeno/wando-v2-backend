import InstitutionService from "./institution.service";
import { injectable } from "tsyringe";
import { FastifyRequest, FastifyReply } from "fastify";
@injectable()

class InstitutionController {
    constructor(
        private readonly institutionService: InstitutionService
    ){}

    fetchInstitutions = async (req: FastifyRequest, res: FastifyReply) => {
        const {queries, page, limit} = req.query as any;
        const pageNumber = page ? parseInt(page) : undefined;
        const limitNumber = limit ? parseInt(limit) : undefined
        const data = await this.institutionService.fetchInstitutions(JSON.parse(queries), pageNumber, limitNumber);
        return res.send(data);
    }

    fetchInstitutionCountries = async (req: FastifyRequest, res: FastifyReply) => {
        const data = await this.institutionService.fetchInstitutionCountries();
        return res.send(data);
    }
}

export default InstitutionController;