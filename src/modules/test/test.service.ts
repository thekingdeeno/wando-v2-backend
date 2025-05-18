import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";
import { genNumber, genUUID, genAlphaString, genAlphaNum } from "../../shared/utils/generate.utils";

@injectable()
class TestService {
    constructor(
        private redisService: RedisService,
    ) {}

    async test(){
        // running teste here
        console.log(genAlphaNum(20));
        
        
    }
    
}

export default TestService;