import { setReq } from '../utils/request.utils';
import { convertBufferToReadableStream } from '../utils/media.util';

import httpStatus from 'http-status';

const multipathMiddleware = async (req: any, res: any, next: any) => {
  try {

    const files = await req.parts()

    const uploads: any = [];
    let normalBody: any = {};

        await(async () => {
          for await (const file of files) {
            const {filename, fieldname, encoding, mimetype} = file;
            if (mimetype === 'text/plain') {
              normalBody[`${fieldname}`] = file.value
            }else{
              const buffer = await file.toBuffer();
              const readableStream = convertBufferToReadableStream(buffer);
              uploads.push({
                filename, fieldname, encoding, mimetype, buffer, readableStream
              }) 
            }
          }})();

        setReq(req, 'body', {uploads, ...normalBody} )
        return
  } catch (error: any) {
    console.log(`multipathMiddleware====> ${error}`);
    throw new Error(httpStatus.UNAUTHORIZED + ' multipath failed');
  };
};

export default multipathMiddleware;
