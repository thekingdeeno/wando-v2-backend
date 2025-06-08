import { Upload, UploadModel, UploadPartialType, UploadI } from "../model/uploads";
import { BaseRepository } from "./base.repository";

export class UploadRepository extends BaseRepository<Upload, UploadI> {
    constructor(){
        super(UploadModel);
    };

    async recordUpload(payload: UploadPartialType){
        return await new UploadModel(payload).save();
    };

    async deleteUploadByPath(userId: string ,path: string){
        return await UploadModel.deleteOne({uploader: userId, path}).exec();
    }

    async deleteOldPfp(userId: string ,newUpload: string){
        return await UploadModel.deleteMany({'uploader': userId, category: 'pfp', 'uploadId': {$ne: newUpload}}).exec();
    }
}