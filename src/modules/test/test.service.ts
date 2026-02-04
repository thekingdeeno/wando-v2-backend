import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";
import { genNumber, genUUID, genAlphaString, genAlphaNum } from "../../shared/utils/generate.utils";
// import j from '../../../'

@injectable()
class TestService {
    constructor(
        private redisService: RedisService,
    ) {}

    async test(){
        // running teste here
        console.log(genAlphaNum(20));
        const response = await fetch('../../../../../institutions.base.json');
        const json = await response.json();
        console.log(json[0]);
    }
    
}

export default TestService;