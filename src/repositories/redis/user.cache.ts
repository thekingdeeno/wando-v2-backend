import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";

const pathPrefix = 'user-repo'

@injectable()
class UserCache {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    setPartialUser = async (firstName: string, lastName: string, email: string, otp: string) => {
        const data = JSON.stringify({firstName, lastName, otp})
        return await this.redisService.setDataWithExpiry(`${pathPrefix}:new-partial-user:${email}`, data, 60 * 10)
    }

    getPartialUser = async (email: string) => {
        return await this.redisService.getData(`${pathPrefix}:new-partial-user:${email}`)
    }

    setEmailOTP = async (email: string, otp: string) => {
        return await this.redisService.setDataWithExpiry(`${pathPrefix}:email-otp:${email}`, otp, 60*10);
    };
    
    getEmailOTP = async (email: string,) => {
        return await this.redisService.getData(`${pathPrefix}:email-otp:${email}`);
    };

}

export default UserCache;