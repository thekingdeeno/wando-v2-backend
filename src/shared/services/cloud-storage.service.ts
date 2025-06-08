import { injectable } from 'tsyringe';
import CloudinaryService from "../implementations/cloudinary.service"
import { UploadRepository } from "../../repositories/upload.repository";


@injectable()
class UploadService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private uploadRepository: UploadRepository,
    ){}

    public async uploadMedia(userId: string, handler: string, category: string, payload: any){
        try {
            
            if (handler === 'cloudinary') {
                const {file, fileName, filePath} = payload
                const response = await this.cloudinaryService.upload(file, fileName, filePath);

                if (!response.url) throw new Error('Invalid cloudinary response');
                
                const record = await this.uploadRepository.recordUpload({
                    uploader: userId,
                    category,
                    fileType: response.fileType,
                    fileFormat: response.fileformat,
                    fileName: response.fileName,
                    host: handler,
                    path: response.path,
                    url: response.url,
                });

                if (!record) {
                    console.log('failed to record upload');
                }
                
                return{status: true, record}
            };
        } catch (error: any) {
            return{
                status: false,
                message: error.message
            };
        };
    };

    public async deleteMedia(handler: string, payload: any){
        try {
            if (handler === 'cloudinary') {
                const {userId, path, resourceType} = payload
                const data = await this.cloudinaryService.delete(path, resourceType)
                await this.uploadRepository.deleteUploadByPath(userId, path)
            }
        } catch (error: any) {
            return{
                status: false,
                message: error.message
            };
        }
    }

};

export default UploadService