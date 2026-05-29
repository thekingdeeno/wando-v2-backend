import { injectable } from "tsyringe";
import { UserRepository } from "../../repositories/user.repository";
import { ObjectLiteral } from "../../shared/types/general.type";
import httpStatus from 'http-status';
import { genNumber } from "../../shared/utils/generate.utils";
import UserCache from "../../repositories/redis/user.cache";
import MessagingService from "../../shared/services/messaging.service";
import { UserPartialType } from "../../model/users";

@injectable()
class RegistrationService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly userChache: UserCache,
        private readonly messagingService: MessagingService,
    ){}

    async saveUserToCache(payload: ObjectLiteral){
        try {
            const {status, message} = await this.checkEmailAvailability(payload.email);
            if (!status) {
                throw new Error(message);
            }
            const {firstName, lastName, email} = payload;
            email.toLowerCase(); firstName.toLowerCase(); lastName.toLowerCase();
            const otp = genNumber(6).toString();
            await this.userChache.setPartialUser(firstName,lastName, email, otp);
            console.log(`OTP for ${email} is ${otp}`);
            
            // await this.messagingService.sendAccountVerificationWithOtpEmail(email, otp);
            return {status: true, message: 'User details saved successfully, OTP sent to email'};
        } catch (error: any) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: 'Failed to save new user details, please try again'};
        };
    };

    async verifyEmailVerifOtp(email: string, otp: string){
        try {
            const data = await this.userChache.getPartialUser(email);
            console.log({data, otp, email});
            
            if (!data) {
                return{status: false, message: 'Your session has probably expired, please signup again'}
            };
           const partialUser = JSON.parse(data);

            if (otp === data) return { status: false, message: "Invalid OTP"};

            return{
                status: true,
                message: "OTP is correct",
                data: partialUser
            };
        } catch (error: any) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: "Failed to verify otp"}
        };
    };

    async registerUser(payload: any){
        try {
            const partialUser = await this.userChache.getPartialUser(payload.email);
            
            if (!partialUser) {
                return{status: false, message: 'Your session has probably expired, please type your email again'}
            }

            if (payload.password !== payload.confirmPassword) {
                return {status: false, message: 'Passwords do not match'};
            }

            const user = JSON.parse(partialUser);
            const {firstName, lastName} = user;
            
            
            const newPayload = {password: payload.password, firstName, lastName, email: payload.email} as UserPartialType;    

            const newUser = await this.userRepo.createUser(newPayload);

            if (!newUser) throw new Error('Failed to create new user, please try again');
            return{
                status: true,
                message: 'User created successfuly',
            };
        } catch (err: any) {
            console.log(err.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: 'Failed to create new user, please try again'};
        }
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