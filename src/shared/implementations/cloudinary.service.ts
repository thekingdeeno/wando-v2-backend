import { injectable } from 'tsyringe';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../../config/env.config';

cloudinary.config(cloudinaryConfig)

const logPrefix = 'CloudinaryService'
@injectable()
class CloudinaryService {
    constructor(){}
    
    public async upload(file: any, destinationFileName: string, destinationFilePath: string){
        try {    
        // Buffer stream upload
        const data: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                public_id: destinationFileName,
                folder: `wando-app/${destinationFilePath}`,
                secure: true,
                },
                (error, uploadResult) => {
                    if (error) return reject(new Error(error.message));
                    resolve(uploadResult);
                }).end(file);
        });
        
        // // Base 64 format upload :-
        // const data = await this.cloudinary.uploader.upload(`data:image/png;base64,${file}`,{public_id: destinationFileName, folder: `wando-app/${destinationFilePath}`});
        
        // Actual (local) file upload :-
        // const data = await this.cloudinary.uploader.upload(`${file}`,{public_id: destinationFileName, folder: `wando-app/${destinationFilePath}`});
        
        return {
            url: data.secure_url,
            name: data.display_name,
            path: data.public_id,
            fileType: data.resource_type,
            fileformat: data.format,
            fileName: data.original_filename
        }
        } catch (error: any) {
            console.log(`Cloudinary Upload Error::${error.message}`);
            return{
                status: false,
                message: error.message
            }
        }
    };

    public async delete(path: string, resource_type: string){
        try {
           const response = await cloudinary.uploader.destroy(path, {resource_type})
           console.log(response);
           return response;
            
        } catch (error: any) {
            console.log(`Cloudinary Delete Error::${error.message}`);
            return{
                status: false,
                message: error.message
            }
        }
    }

    public async createUploadSignature(publicId: string){
        try {
            const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: Math.round((new Date).getTime()/1000),
                eager: '',
                public_id: publicId
            },
                cloudinaryConfig.api_secret
            )

            return signature
        } catch (error: any) {
            console.log(`${logPrefix}[ERROR]::createUploadSignature==> ${error.message}`, {error, publicId});
            
        }
    }
}

export default CloudinaryService