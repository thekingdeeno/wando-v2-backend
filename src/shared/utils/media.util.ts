import { AxiosInstance } from 'axios';
import { Readable } from 'stream';
import { HTTPClient } from './http.util';

let httpClient: AxiosInstance;

const getHttpClient = () => {
  if (!httpClient) {
    httpClient = HTTPClient.create({});
  }

  return httpClient;
};

export const downloadPhotoAsStreamFromUrl = async (url: string): Promise<Readable> => {
  const stream = await getHttpClient().get(url, { responseType: 'stream' });

  return stream.data;
};

export const convertBufferToReadableStream = (buffer: any) => {
  const stream = Readable.from(buffer);
  
  return stream;
}