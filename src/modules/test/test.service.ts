import { injectable } from "tsyringe";
import RedisService from "../../shared/implementations/cache/redis/redis.service";
import { readFile } from "fs/promises";
import InstitutionService from "../institution/institution.service";

@injectable()
class TestService {
    constructor(
        private redisService: RedisService,
        private institutionService: InstitutionService
    ) {}

    async test(){
        const content = await readFile('institutions.base.json', 'utf-8')
        console.log(JSON.parse(content)[0]);
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