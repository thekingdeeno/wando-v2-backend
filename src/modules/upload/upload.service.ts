import { injectable } from "tsyringe";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../../config/env.config";
import { UploadRepository } from "../../repositories/upload.repository";
import { UploadCategoryType } from "../../shared/types/upload.type";
import { Logger } from "../../shared/utils/logger.utils";

type CloudinaryUploadTokenParams = {
  folder?: string;
  resourceType?: "image" | "video" | "raw";
  publicId?: string;
  tags?: string[];
};

const logPrefix = "UploadService";

@injectable()
class UploadService {
  constructor(
    private readonly uploadRepository: UploadRepository
  ) {}

  public async requestUploadToken(params: CloudinaryUploadTokenParams = {}, userId?: string) {
    Logger.info(`${logPrefix} - Requesting upload token`, { params, userId });
    try {
      if (!cloudinaryConfig?.cloud_name || !cloudinaryConfig?.api_key || !cloudinaryConfig?.api_secret) {
        const error = new Error("Cloudinary config is incomplete");
        Logger.error(error, { params, userId });
        throw error;
      }

      const timestamp = Math.floor(Date.now() / 1000);
      const resourceType = params.resourceType ?? "image";

      let payload: any = {
        timestamp,
        folder: `wando-app/${params.folder ?? "uploads"}`,
      };

      if(['pfp', 'banner'].includes(params.folder)){
        payload.public_id = `${userId}_${params.folder}`;
        Logger.info(`${logPrefix} - Setting public ID for user profile`, { userId, folder: params.folder });
      }

      const signature = cloudinary.utils.api_sign_request(
        payload,
        cloudinaryConfig.api_secret,
      );

      Logger.info(`${logPrefix} - Successfully created upload token`, { userId, resourceType });
      return {
        signature,
        payload,
        apiKey: cloudinaryConfig.api_key,
        cloudName: cloudinaryConfig.cloud_name,
        uploadPreset: (cloudinaryConfig as any)?.uploadPreset ?? undefined,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/${resourceType}/upload`,
      };
    } catch (error: any) {
      Logger.error(`${logPrefix} - Failed to create Cloudinary upload token`, { error, params, userId });
      throw new Error(`Failed to create upload token: ${error?.message ?? "Unknown error"}`);
    }
  }

  public async requestUploadTokens(paramsArray: CloudinaryUploadTokenParams[], userId?: string) {
    Logger.info(`${logPrefix} - Requesting multiple upload tokens`, { count: paramsArray.length, userId });
    try {
      const tokens = await Promise.all(
        paramsArray.map((param) => this.requestUploadToken(param, userId)),
      );

      Logger.info(`${logPrefix} - Successfully created ${tokens.length} upload tokens`, { userId });
      return tokens 
    } catch (error: any) {
      Logger.error(`${logPrefix} - Failed to create multiple Cloudinary upload tokens`, { error, count: paramsArray.length, userId });
      throw new Error(`Failed to create multiple upload tokens: ${error?.message ?? "Unknown error"}`);
    }
  }

  public async confirmUpload(data: any[], userId: string): Promise<any> {
    Logger.info(`${logPrefix} - Confirming upload record`, { count: data.length, userId });
    try {
      const results = await Promise.all(
        data.map(async (upload) => {
          let update;
          let uploadRecord;
          
          if(upload.category === 'pfp'){
            Logger.debug(`${logPrefix} - Updating profile picture for user`, { userId });
            update = await this.uploadRepository.updateUpload(userId, 'pfp', {updatedAt: new Date()});
          }

          if(!update?.modifiedCount){
            Logger.debug(`${logPrefix} - Creating new upload record`, { userId, category: upload.category });
            upload.uploader = userId;
            uploadRecord = await this.uploadRepository.recordUpload(upload);
          }

          if(!update?.modifiedCount && !uploadRecord){
            const error = new Error('Failed to create upload record');
            Logger.error(`${logPrefix} - Failed to create upload record`, { error, userId, category: upload.category });
            return {
              status: false,
              message: 'Failed to create upload record'
            }
          }
          
          return {
            status: true,
            message: 'Upload record created successfully',
            userId,
            category: upload.category
          };
        })
      );
      
      Logger.info(`${logPrefix} - Upload records confirmed`, { count: results.length, userId });
      return {
        status: true,
        message: 'Upload records created successfully',
        results
      };
    } catch (error: any) {
      Logger.error(`${logPrefix} - Failed to create upload record`, { error, userId });
      throw new Error(`Failed to create upload record: ${error?.message ?? "Unknown error"}`);
    }
  }
}

export default UploadService;