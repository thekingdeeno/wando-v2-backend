import { injectable } from "tsyringe";
import { UserRepository } from "../../repositories/user.repository";
import { ObjectLiteral } from "../../shared/types/general.type";
import httpStatus from 'http-status';

@injectable()
class RegistrationService {
    constructor(
        private readonly userRepo: UserRepository
    ){}

    async registerUser(payload: ObjectLiteral){
        try {
            const newUser = await this.userRepo.createUser(payload);
            return{
                status: true,
                message: 'User created successfuly',
                data: newUser,
            };
        } catch (err: any) {
            throw {status: false, statusCode: httpStatus.BAD_REQUEST, message: err.message};
        }
    };

    async sendEmailVerifOtp(email: string, otp: number){
        try {
            
        } catch (error) {
            throw {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message}
        }

    }

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
        }
    }

    async checkEmailAvailability(email: string){
        try {
            const existing = await this.userRepo.findUserByEmail(email);
            if (existing) {
                throw new Error('A user with this email already exists');
            };
        } catch (error) {
            throw {status: false, statusCode: httpStatus.CONFLICT, message: error.message};
        };
    };
    
    async checkPhoneNoAvailability(phoneNumber: string){
        try {
            const existing = await this.userRepo.findUserByPhoneNo(phoneNumber);
            if (existing) {
                throw new Error('A user with this phone number already exists');
            };
        } catch (error) {
            throw {status: false, statusCode: httpStatus.CONFLICT, message: error.message};
        };
    };

    async checkUsernameAvailability(username: string){
        try {
            const existing = await this.userRepo.findUserByUsername(username);
            if (existing) {
                throw new Error('A user with this username already exists');
            };
        } catch (error) {
            throw {status: false, statusCode: httpStatus.CONFLICT, message: error.message};
        };
    };
};

export default RegistrationService;