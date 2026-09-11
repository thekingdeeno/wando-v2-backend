import { injectable } from "tsyringe";
import UploadService from "./upload.service";
import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";
import { getReq } from "../../shared/utils/request.utils";

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
            console.error("Failed to create Cloudinary upload token:", error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: `Failed to create upload token: ${error?.message ?? "Unknown error"}` });
        }
    }
}

export default UploadController;