import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";
import InstitutionService from "../institution/institution.service";


@injectable()
class TestService {
    constructor(
        private redisService: RedisService,
        private institutionService: InstitutionService
    ) {}

    async test(){
        
        return{
            status: true,
            // data: response,
            message: 'webhook received',
        }
    }

   public async seedInstitutions(start: number, batch: number){
        const res = await this.institutionService.seedInstitutions(start, batch)

        return{
            status: true,
            message: 'completed',
            data: res
        }
    }
}

export default TestService;