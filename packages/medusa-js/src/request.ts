import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
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

  request(method: Types.RequestMethod, path: string, payload: any = {}): AxiosPromise<any> {
    const options: AxiosRequestConfig = {
      method,
      withCredentials: true,
      url: path,
      data: payload,
    };

    return this.axiosClient(options);
  }
}

export default Client;
