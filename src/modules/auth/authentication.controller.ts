import { injectable } from "tsyringe";
import AuthenticationService from "./authentication.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { LoginForm } from "../../shared/types/general.type";
import httpStatus from 'http-status';


@injectable()
class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ){}

    login = async (req: FastifyRequest, res: FastifyReply) => {
        const payload = req.body as LoginForm;
        const data = await this.authenticationService.login(payload);
        return res.status(httpStatus.OK).send(data);
    };

    loginFromOtp = async (req: FastifyRequest, res: FastifyReply) => {
        const {email, otp, password} = req.body as {email: string, otp: string, password: string};
        const data = await this.authenticationService.loginFromOtp(email, otp, password);
        return res.status(httpStatus.OK).send(data);
    };
};

export default AuthenticationController;