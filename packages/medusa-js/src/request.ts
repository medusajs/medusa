<<<<<<< HEAD
import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
=======
import axios, { AxiosInstance } from 'axios';
>>>>>>> typescript
import * as Types from './types';

export interface Config {
  baseUrl: string;
}

class Client {
  private axiosClient: AxiosInstance;

  constructor(config: Config) {
    this.axiosClient = axios.create({
      baseURL: config.baseUrl,
    });
  }

<<<<<<< HEAD
  request(method: Types.RequestMethod, path: string, payload: any = {}): AxiosPromise<any> {
    const options: AxiosRequestConfig = {
=======
  request(method: Types.RequestMethod, path: string, payload: object) {
    const options = {
>>>>>>> typescript
      method,
      withCredentials: true,
      url: path,
      data: payload,
<<<<<<< HEAD
=======
      json: true,
>>>>>>> typescript
    };

    return this.axiosClient(options);
  }
}

export default Client;
