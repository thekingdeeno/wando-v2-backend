import RegistrationService from "./registration.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { injectable } from "tsyringe";

@injectable()
class RegistrationController {
    constructor(
        // registrationService: RegistrationService
    ){}

    registerUser = async (req: FastifyRequest, res: FastifyReply) => {
        console.log(req)
    }
}

export default RegistrationController