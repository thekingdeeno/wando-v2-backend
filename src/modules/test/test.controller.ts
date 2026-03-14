import { injectable } from "tsyringe";
import TestService from "./test.service";
import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";


@injectable()
class TestController {
    constructor(
        private readonly testService: TestService
    ) {}

    test = async (req: FastifyRequest, res: FastifyReply) => {
        const { start, batch } = req.body as any;
        const data = await this.testService.seedInstitutions(start, batch);
        return res.status(httpStatus.OK).send(data);
    }
}

export default TestController