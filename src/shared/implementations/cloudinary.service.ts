import { injectable } from 'tsyringe';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '../../config/env.config';

cloudinary.config(cloudinaryConfig)


@injectable()
class CloudinaryService {
    constructor(){}
    
    public async upload(file: any, destinationFileName: string, destinationFilePath: string){
        try {    
        // Buffer stream upload
        const data: any = await new Promise((resolve) => {
            cloudinary.uploader.upload_stream(
                {
                public_id: destinationFileName,
                folder: `wando-app/${destinationFilePath}`
                },
                (error, uploadResult) => {
                    if (error) throw new Error(error.message);
                    return resolve(uploadResult);
                }).end(file);
        });

        // // Base 64 format upload :-
        // const data = await this.cloudinary.uploader.upload(`data:image/png;base64,${file}`,{public_id: destinationFileName, folder: `wando-app/${destinationFilePath}`});
        
        // Actual (local) file upload :-
        // const data = await this.cloudinary.uploader.upload(`${file}`,{public_id: destinationFileName, folder: `wando-app/${destinationFilePath}`});
        
        return {
            url: data.url,
            name: data.display_name,
            path: data.public_id,
            fileType: data.resource_type,
            fileformat: data.format,
            fileName: data.displayName
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
           
        } catch (error) {
            console.log(`Cloudinary Delete Error::${error.message}`);
            return{
                status: false,
                message: error.message
            }
        }
    }
}

export default CloudinaryService