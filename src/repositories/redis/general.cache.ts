import { injectable } from "tsyringe";  
import RedisService from "../../shared/implementations/cache/redis/redis.service";
import { UtilsCachePath } from "../../shared/enums/cache-paths.enums";

const pathPrefix = 'general-repo'

@injectable()
class GeneralCache {
    constructor(
        private readonly redisService: RedisService,
    ) {}

    addInstitutionCountryToCache = async (country: string,) => {
        const existingData = await this.redisService.getData(`${UtilsCachePath.INSTITUTIONS}`);
        const countruies = existingData ? JSON.parse(existingData) : [];
        return await this.redisService.setData(`${UtilsCachePath.INSTITUTIONS}`, JSON.stringify(countruies.concat(country)));
    }

    getInstitutionCountries = async () => {
        const existingData = await this.redisService.getData(`${UtilsCachePath.INSTITUTIONS}`);
        return existingData ? JSON.parse(existingData) : [];
    }   
}

export default GeneralCache;