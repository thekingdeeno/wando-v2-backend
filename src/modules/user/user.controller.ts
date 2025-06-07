import { injectable } from "tsyringe";
import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "./user.service";
import httpStatus from 'http-status';
import { getReq } from "../../shared/utils/request.utils";

@injectable()
class UserController {
    constructor(
        private readonly userService: UserService,
    ){};

    fetchUserById = async (req: FastifyRequest, res: FastifyReply) => {
        const {userId} = req.query as any
        let id: string        
        if (userId) {id = userId}else{id = getReq(req, 'userId')}
        const data = await this.userService.fetchUserById(id);
        return res.status(httpStatus.OK).send(data);
    }

    updateUser = async (req: FastifyRequest, res: FastifyReply) => {
        const payload = req.body;
        const {userId} = req.params as any;
        const data = await this.userService.updateUser(userId, payload)
        return res.status(httpStatus.OK).send(data); 
    }

    uploadPfp = async (req: FastifyRequest, res: FastifyReply) => {
        const {uploads} = req.body as any;
        const data = await this.userService.updatePfp(getReq(req, 'userId'), uploads[0]);
        return res.status(httpStatus.OK).send(data);
    }

    fetchFollowers = async (req: FastifyRequest, res: FastifyReply) => {
        const {userId} = req.params as any;
        const data = await this.userService.fetchFollowers(userId);
        return res.status(httpStatus.OK).send(data);
    }

    followUser = async (req: FastifyRequest, res: FastifyReply) => {
        const {userId} = req.params as any;
        const data = await this.userService.followUser(getReq(req, 'userId'), userId)
        return res.status(httpStatus.OK).send(data);
    }
}

export default UserController;