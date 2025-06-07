import { Upload, UploadModel, UploadPartialType, UploadI } from "../model/uploads";
import { BaseRepository } from "./base.repository";

export class UploadRepository extends BaseRepository<Upload, UploadI> {
    constructor(){
        super(UploadModel);
    };

    async recordUpload(payload: UploadPartialType){
        return await new UploadModel(payload).save();
    };
}