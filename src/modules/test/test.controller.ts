import { injectable } from "tsyringe";
import TestService from "./test.service";
import { FastifyRequest, FastifyReply } from "fastify";


@injectable()
class TestController {
    constructor(
        private readonly testService: TestService
    ) {}

    test = async (req: FastifyRequest, res: FastifyReply)=>{
        await this.testService.test()
        return {
            status: true,
            message: 'test-ran :)'
        }
    }

}

export default TestController