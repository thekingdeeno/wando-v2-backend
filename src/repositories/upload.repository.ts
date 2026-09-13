import { Upload, UploadModel, UploadPartialType, UploadI } from "../model/uploads";
import { BaseRepository } from "./base.repository";
import { Logger } from "../shared/utils/logger.utils";

const logPrefix = "UploadRepository";

export class UploadRepository extends BaseRepository<Upload, UploadI> {
    constructor(){
        super(UploadModel);
    };

    async recordUpload(payload: UploadPartialType){
        try {
            return await new UploadModel(payload).save();
        } catch (error) {
            Logger.error(`${logPrefix} - Failed to record upload`, { error, payload });
            throw error;
        }
    };

    async deleteUploadByPath(userId: string ,path: string){
        try {
            return await UploadModel.deleteOne({uploader: userId, path}).exec();
        } catch (error) {
            Logger.error(`${logPrefix} - Failed to delete upload by path`, { error, userId, path });
            throw error;
        }
    }

    async updateUpload(userId: string, category: string, paylaod: Partial<Upload>){
        try {
            return await UploadModel.updateOne({uploader: userId, category}, paylaod).exec();
        } catch (error) {
            Logger.error(`${logPrefix} - Failed to update upload`, { error, userId, category });
            throw error;
        }
    }

    async deleteOldPfp(userId: string ,newUpload: string){
        try {
            return await UploadModel.deleteMany({'uploader': userId, category: 'pfp', 'uploadId': {$ne: newUpload}}).exec();
        } catch (error) {
            Logger.error(`${logPrefix} - Failed to delete old profile pictures`, { error, userId });
            throw error;
        }
    };

    async deleteOldBanner(userId: string ,newUpload: string){
        try {
            return await UploadModel.deleteMany({'uploader': userId, category: 'banner', 'uploadId': {$ne: newUpload}}).exec();
        } catch (error) {
            Logger.error(`${logPrefix} - Failed to delete old banners`, { error, userId });
            throw error;
        }
    };
}