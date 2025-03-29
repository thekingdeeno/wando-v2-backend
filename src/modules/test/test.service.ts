import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";

@injectable()
class TestService {
    constructor(
        private redisService: RedisService,
    ) {}

    async test(){
        // running teste here
    }
    
}

export default TestService;