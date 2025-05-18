import { injectable } from "tsyringe";
import { UserRepository } from "../../repositories/user.repository";
import { ObjectLiteral } from "../../shared/types/general.type";
import httpStatus from 'http-status';
import { genNumber } from "../../shared/utils/generate.utils";
import UserCache from "../../repositories/redis/user.cache";
import MessagingService from "../../shared/services/messaging.service";

@injectable()
class RegistrationService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly userChache: UserCache,
        private readonly messagingService: MessagingService,
    ){}

    async registerUser(payload: ObjectLiteral){
        try {
            const {status, message} = await this.checkEmailAvailability(payload.email);
            if (!status) {
                throw new Error(message);
            }
            const newUser = await this.userRepo.createUser(payload);
            const {firstName, lastName, email} = newUser;
            if (newUser) {
                this.sendEmailVerifOtp(email)
            }
            return{
                status: true,
                message: 'User created successfuly',
                data: {firstName, lastName, email},
            };
        } catch (err: any) {
            console.log(err.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: err.message};
        }
    };

    async sendEmailVerifOtp(email: string){
        try {
            const otp = genNumber(6).toString();
            const data = await this.userChache.setEmailOTP(email, otp);
            const mail = await this.messagingService.sendAccountVerificationWithOtpEmail(email, otp);

            return{
                status: true,
                message: "Email Verif OTP sent successfuly"
            }
        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message}
        };
    };

    async verifyEmailVerifOtp(email: string, otp: string){
        try {
            const data = await this.userChache.getEmailOTP(email);
            if (otp === data) {
                const user = await this.userRepo.findUserByEmail(email)
                if (user.isVerified === false) {
                    const {acknowledged} = await this.userRepo.updateByUserId(user.userId, {isVerified: true});
                    if (acknowledged === false) return {status: false, message: 'OTP valid but failed to update account'}
                }
                return{
                    status: true,
                    message: "OTP is correct"
                }
            }else{
                return {
                    status: false,
                    message: "Invalid or Expired OTP"
                }
            }
        } catch (error: any) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message}
        };
    };

    async checkExisting(fieldName: string, value: string){
        switch (fieldName) {
            case 'email':
                await this.checkEmailAvailability(value);
                break;
                case 'phoneNumber':
                await this.checkPhoneNoAvailability(value);
                break;
                case 'username':
                await this.checkUsernameAvailability(value);
                break;
            default:
                break;
        };
    };

    async checkEmailAvailability(email: string){
        try {
            const existing = await this.userRepo.findUserByEmail(email);
            if (existing) {
                throw new Error('A user with this email already exists');
            };
            return {status: true}
        } catch (error) {
            return {status: false, statusCode: httpStatus.CONFLICT, message: error.message};
        };
    };
    
    async checkPhoneNoAvailability(phoneNumber: string){
        try {
            const existing = await this.userRepo.findUserByPhoneNo(phoneNumber);
            if (existing) {
                throw new Error('A user with this phone number already exists');
            };
            return {status: true}
        } catch (error) {
            return {status: false, statusCode: httpStatus.CONFLICT, message: error.message};
        };
    };

    async checkUsernameAvailability(username: string){
        try {
            const existing = await this.userRepo.findUserByUsername(username);
            if (existing) {
                throw new Error('A user with this username already exists');
            };
        } catch (error) {
            console.log(error.message);
            throw {status: false, statusCode: httpStatus.CONFLICT, message: error.message};
        };
    };
};

export default RegistrationService;