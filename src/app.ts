import "reflect-metadata"
import 'dotenv/config'
import fastify, {FastifyInstance} from 'fastify';
import RouteVersion from './shared/enums/route.config.enum';
import bootstrapApp from "./bootstrap";
import RedisClient from "./shared/implementations/cache/redis/redis.client";
import { container } from "tsyringe";
import testRoute from "./modules/test/test.route";
import registrationRoute  from './modules/signup/registration.route';
import authenticationRoute from "./modules/auth/authentication.route";
import userRoute from "./modules/user/user.route";
import multipart from "@fastify/multipart";
import postRoute from "./modules/post/post.route";
import institutionRoute from "./modules/institution/institution.route";
class App {
  private fastify: FastifyInstance;

  constructor(){
    this.fastify = fastify({logger: false, bodyLimit: 1067008})

    this.registerModules();
    bootstrapApp();
  };

  private registerModules(){
    this.fastify.register(multipart);
    this.fastify.register(registrationRoute, { prefix: RouteVersion['v1.register'] });
    this.fastify.register(authenticationRoute, {prefix: RouteVersion['v1.authentication']});
    this.fastify.register(testRoute, {prefix: RouteVersion['v1.test']});
    this.fastify.register(userRoute, {prefix: RouteVersion['v1.user']});
    this.fastify.register(postRoute, {prefix: RouteVersion['v1.post']});
    this.fastify.register(institutionRoute, {prefix: RouteVersion['v1.institution']})
  }

  public getInstance(){
    return this.fastify;
  };

  public async close() {
    await this.fastify.close();
    container.resolve(RedisClient).disconnect();
  };


  public listen(port: number,) {
    return this.fastify.listen({ port }, (err,  address = '0.0.0.0') => {
      if (err) {
        console.error(err)
        process.exit(0)
      }
      console.log(`Server listening at ${address}`)
    })
  }
};

export default App;
