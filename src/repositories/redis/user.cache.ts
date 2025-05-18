import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";

const pathPrefix = 'user-repo'

@injectable()
class UserCache {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    setEmailOTP = async (email: string, otp: string) => {
        return await this.redisService.setDataWithExpiry(`${pathPrefix}:email-otp:${email}`, otp, 60*10);
    };
    
    getEmailOTP = async (email: string,) => {
        return await this.redisService.getData(`${pathPrefix}:email-otp:${email}`);
    };

}

export default UserCache;