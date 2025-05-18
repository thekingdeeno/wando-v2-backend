import { injectable } from "tsyringe";
import { LoginForm } from "../../shared/types/general.type";
import { UserRepository } from "../../repositories/user.repository";
import { bcryptCompareHashedString } from "../../shared/utils/hash.utils";
import httpStatus from 'http-status'
import RegistrationService from "../signup/registration.service";
import jwt from "jsonwebtoken";

@injectable()
class AuthenticationService {
    userRepo: any;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly registrationService: RegistrationService,
    ){};

    async login(payload: LoginForm){
        try {
            const {email, password} = payload;
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                return{ status: false, message: 'No account found for this email'};
            };
            const passCheck = await bcryptCompareHashedString(password, user.password)
            if (!passCheck) {
                return{ status: false, message: 'Incorrect Password'};
            };
            const accessToken = jwt.sign({email: user.email, id: user.userId}, 'somejwtsecret')
            return{
                status: true,
                message: 'User Logged In Successfuly',
                data: {email, userId: user.userId, accessToken}
            };
        } catch (err) {
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: err.message};
        }
    }

        async loginFromOtp(email: string, otp: string, password: string){
        try {
            const verif = await this.registrationService.verifyEmailVerifOtp(email, otp);
            if (verif.status === false) {
                return verif;
            };
            return await this.login({email, password});
        } catch (error) {
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        }
    }
}

export default AuthenticationService;