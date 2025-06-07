import { Storage } from "@google-cloud/storage";
import { gcp } from "../../../../config/env.config";
import { convertBufferToReadableStream } from "../../../utils/media.util";
import { injectable } from 'tsyringe';


@injectable()
class GcloudStorageService {
    private storage;

    constructor(){
        this.storage = this.createStorage();
    }

    private createStorage() {
        const config =
            // ? { projectId: gcp.project_id } :
            { projectId: gcp.project_id, keyFilename: gcp.stagingkeyFilenamePath};
        return new Storage(config);
    }

    async uploadMedia(body: { bucketName: string; localReadStream: any; destinationFilePath: string; destinationFileName: string }) {
    try {
      const bucketName = body.bucketName;
      // const stream = await downloadPhotoAsStreamFromUrl(body.localReadStream);
      const stream = convertBufferToReadableStream(body.localReadStream);
      const bucket = this.storage.bucket(bucketName);

      const mediaUrl = `https://storage.googleapis.com/${bucketName}/${body.destinationFilePath}${body.destinationFileName}`;
      const filePath = `${body.destinationFilePath}${body.destinationFileName}`;
      const file = bucket.file(filePath);

      const uploadStream = file.createWriteStream();

      stream.pipe(uploadStream);
      return new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          console.log(`Media uploaded to Google Cloud Storage for ${body.destinationFileName.split('.')[0]} :: ${mediaUrl}`);
          console.log('SUCCESSFUL MEDIA UPLOAD');
          resolve(mediaUrl);
        });
        uploadStream.on('error', (error) => {
          console.log('FAILED MEDIA UPLOAD', error.message|| error);
          resolve('');
        });
      });
    } catch (error) {
      console.log(`Google Cloud Upload Error:`);
      console.log(error);
    }
  }

  async deleteMedia(body: { bucketName: string; destinationFilePath: string; destinationFileName: string }){
    try {
      const {bucketName} = body;
      const filePath = `${body.destinationFilePath}${body.destinationFileName}`;
  
      return new Promise((resolve, reject) => {
    
        this.storage
            .bucket(bucketName)
            .file(filePath)
            .delete()
            .then((image) => {
              console.log('MEDIA SUCCESSFULLY DELETED')
                resolve(image);
            })
            .catch((e) => {
              console.log('Google Cloud Delete Error', e);
                reject(e);
            });
    
      });
    } catch (error) {
      console.log(`FAILED MEDIA DELETION`);
      console.log(error);
    }

  }

}

export default GcloudStorageService