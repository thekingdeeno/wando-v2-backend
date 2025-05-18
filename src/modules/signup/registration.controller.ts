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

        return res.status(httpStatus.OK).send(data);
    };

    checkExisting = async (req: FastifyRequest, res: FastifyReply) => {
        const {fieldName, value} = req.query as any;
        const data = await this.registrationService.checkExisting(fieldName, value);
        return res.status(httpStatus.OK).send(data);
    };

    sendEmailVerifOtp = async(req: FastifyRequest, res: FastifyReply) => {
        const {email} = req.params as any;
        const data =  await this.registrationService.sendEmailVerifOtp(email);

        return res.status(httpStatus.OK).send(data);
    }

    verifyEmailVerifOtp = async(req: FastifyRequest, res: FastifyReply) => {
        const {email, otp} = req.params as any;
        const data = await this.registrationService.verifyEmailVerifOtp(email, otp);

        return res.status(httpStatus.OK).send(data);
''    };
};

export default RegistrationController