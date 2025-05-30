import RedisClient from "./redis.client";
import { container, injectable } from "tsyringe";

const redis = container.resolve(RedisClient).connect();

@injectable()
class RedisService {
    constructor(
    ){}

    public async setData(key: string, value: string, lock?: boolean){
        try {
            return (await redis).set(key, value);
        } catch (error: any) {
            console.log(`ERROR:: redis error ===> ${error.message || 'unable to set redis value'}`);
            return false
        }
    }

    public async setDataWithExpiry(key: string, value: string, seconds: number, lock?: boolean){
        try {
            // let E
            return (await redis).set(key, value, {EX: seconds} )
        } catch (error: any) {
            console.log(`Error::RedissetDataWithExpiry ===> ${error.message} || could not set with expiry`);
        };
    };

    public async getData(key: string){
        try {
            return (await redis).get(key)
        } catch (error: any) {
            console.log(`Error:: redis error ===> ${error.message || 'unable to get redis value'}`);
            return false
        }
    }

    public async delData(key: string){
        try {
            return (await redis).del(key)
        } catch (error: any) {
            console.log(`Error:: redis error ===> ${error.message || 'unable to delete redis value'}`)
            return false
        }
    }
}

export default RedisService