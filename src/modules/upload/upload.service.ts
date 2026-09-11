import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../../config/env.config";

type CloudinaryUploadTokenParams = {
  folder?: string;
  resourceType?: "image" | "video" | "raw";
  publicId?: string;
  tags?: string[];
};

const logPrefix = "UploadService";

@injectable()
class UploadService {
  constructor() {}

  public async requestUploadToken(params: CloudinaryUploadTokenParams = {}, userId?: string) {
    try {
      if (!cloudinaryConfig?.cloud_name || !cloudinaryConfig?.api_key || !cloudinaryConfig?.api_secret) {
        throw new Error("Cloudinary config is incomplete");
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const resourceType = params.resourceType ?? "image";

      let payload: any = {
        timestamp,
        folder: `wando-app/${params.folder ?? "uploads"}`,
      };

      if(['pfp', 'banner'].includes(params.folder)){
        payload.public_id = `${userId}_${params.folder}`;
      }

      const signature = cloudinary.utils.api_sign_request(
        payload,
        cloudinaryConfig.api_secret,
      );

      console.log(`[${logPrefix}] Upload token created successfully`, { params, payload });

      return {
        signature,
        payload,
        apiKey: cloudinaryConfig.api_key,
        cloudName: cloudinaryConfig.cloud_name,
        uploadPreset: (cloudinaryConfig as any)?.uploadPreset ?? undefined,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/${resourceType}/upload`,
      };
    } catch (error: any) {
      console.error("Failed to create Cloudinary upload token:", error);
      throw new Error(`Failed to create upload token: ${error?.message ?? "Unknown error"}`);
    }
  }
}

export default UploadService;