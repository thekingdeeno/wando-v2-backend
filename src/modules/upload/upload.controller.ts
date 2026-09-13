import { injectable } from "tsyringe";
import UploadService from "./upload.service";
import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";
import { getReq } from "../../shared/utils/request.utils";
import { Logger } from "../../shared/utils/logger.utils";

const logPrefix = "UploadController";

@injectable()
class UploadController {
    constructor(
        private readonly uploadService: UploadService
    ) {}

    requestUploadToken = async (req: FastifyRequest, res: FastifyReply) => {
        const { folder, resourceType, publicId, tags } = req.body as any;
        try {
            const token = await this.uploadService.requestUploadToken({
                folder,
                resourceType,
                publicId,
                tags
            }, getReq(req,'userId'));
            return res.status(httpStatus.OK).send(token);
        } catch (error: any) {
            Logger.error(`${logPrefix} - Failed to create Cloudinary upload token`, { error, userId: getReq(req,'userId') });
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Failed to create upload token: ${error?.message ?? "Unknown error"}` });
        }
    }

    requestUploadTokens = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const {uploads} = req.body as any
            const tokens = await this.uploadService.requestUploadTokens(uploads, getReq(req,'userId'));
            return res.status(httpStatus.OK).send(tokens);
        } catch (error: any) {
            Logger.error(`${logPrefix} - Failed to create Cloudinary upload tokens`, { error, userId: getReq(req,'userId') });
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Failed to create upload token: ${error?.message ?? "Unknown error"}` });
        }
    }

    confirmUpload = async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const {uploads} = req.body as any
            const uploadRecord = await this.uploadService.confirmUpload(uploads, getReq(req, 'userId'));
            return res.status(httpStatus.OK).send(uploadRecord);
        } catch (error: any) {
            Logger.error(`${logPrefix} - Failed to confirm upload`, { error, userId: getReq(req,'userId') });
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Failed to confirm upload: ${error?.message ?? "Unknown error"}` });
        }
    }
}

export default UploadController;