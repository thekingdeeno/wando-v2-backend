import { injectable } from "tsyringe";
import RegistrationService from "./registration.service";
import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from 'http-status';

@injectable()
class RegistrationController {
    constructor(
        private readonly registrationService: RegistrationService,
    ){};

    registerUser = async (req: FastifyRequest, res: FastifyReply) => {
        const payload = req.body;
        
        const data = await this.registrationService.registerUser(payload);

        return res.status(httpStatus.OK).send(data)
    };

    checkExisting = async (req: FastifyRequest, res: FastifyReply) => {
        const {fieldName, value} = req.query as any;
        const data = await this.registrationService.checkExisting(fieldName, value);
        return res.status(httpStatus.OK).send(data);
    };
};

export default RegistrationController