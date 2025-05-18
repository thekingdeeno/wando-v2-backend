import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const authMiddleware = async (req:FastifyRequest, res: FastifyReply) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            console.log(`No Headers, headers: ${JSON.stringify(req.headers)}`);
            throw new Error(`${httpStatus.UNAUTHORIZED}::No headers or auth header provided`)
        }

        const authorization = req.headers.authorization.split(' ');
        const jwtToken = authorization[1];
        const payload: any = jwt.decode(jwtToken);
        if (!payload.id) {
            throw new Error(`${httpStatus}: Unauthuarized user`)
        };

        setReq(req, 'userId', payload.id)
        
    } catch (error) {
        console.log(error.message)
        res.status(httpStatus.UNAUTHORIZED).send({status: false, statusCode: httpStatus.UNAUTHORIZED, message: error.message})
    }
}

function setReq(req: any, field: string, value: any) {
    return req[`${field}`] = value;
}

export function getReq(req: any, field: string){
    return req[`${field}`]
}

export default authMiddleware