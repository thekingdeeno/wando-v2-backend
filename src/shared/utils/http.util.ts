import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import * as http from 'http';
import * as https from 'https';

export class HTTPClient {
  static create(config: AxiosRequestConfig): AxiosInstance {
    config.httpAgent = new http.Agent({ keepAlive: true });
    config.httpsAgent = new https.Agent({ keepAlive: true });
    config.headers = Object.assign({ 'content-type': 'application/json', 'Accept': 'application/json' }, config.headers);

    return axios.create(config);
  }
}
