import { createClient } from "redis"
import { redis } from "../../../../config/env.config";
import { injectable } from "tsyringe";

@injectable()
class RedisClient {
    constructor(
    ){}

      private async createClient() {
        const {user,host, port, password} = redis;
        const redisClient = createClient({
          username: user,
          password,
          socket: {
              host,
              port: parseInt(port)
          }
      })
    
        redisClient.on('error', (err: any) => {
          console.log({ err }, 'Redis client connection error');
        });
    
        redisClient.on('ready', () => {
          console.log('Redis client is ready');
        });
    
        redisClient.on('reconnecting', () => {
          console.log('Redis client is reconnected');
        });
    
        return redisClient;
      }

      public async connect(){
        try {
          return (await this.createClient()).connect()
        } catch (error: any) {
          console.log(`ERROR::REDIS-CONNECT ==> ${error.message || 'there was a problem connecting to redis'}`);
        }
      }

      public async disconnect(){
        try {
          return (await this.createClient()).disconnect();
        } catch (error: any) {
          console.log(`ERROR::REDIS-DISCONNECT ===> ${error.message || 'unclean disconnection'}`);
        }
      }
    
};

export default RedisClient;