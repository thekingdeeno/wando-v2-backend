import { injectable } from 'tsyringe';
import CloudinaryService from "../implementations/cache/redis/cloudinary.service"
import { UploadRepository } from "../../repositories/upload.repository";


@injectable()
class UploadService {
    constructor(
        private cloudinaryService: CloudinaryService,
        private uploadRepository: UploadRepository,
    ){}

    public async uploadMedia(handler: 'gcloud' | 'cloudinary', payload: any){
        try {
            
            if (handler === 'cloudinary') {
                const {file, fileName, filePath} = payload
                const response = await this.cloudinaryService.upload(file, fileName, filePath);
                

                if (!response.url) throw new Error('Invalid cloudinary response');
                
                const record = await this.uploadRepository.recordUpload({
                    category: 'pfp',
                    fileType: response.fileType,
                    fileFormat: response.fileformat,
                    fileName: response.fileName,
                    host: handler,
                    path: response.path,
                    url: response.url,
                });
                
                return{status: true, record}
            };
        } catch (error: any) {
            return{
                status: false,
                message: error.message
            };
        };
    };

};

export default UploadService