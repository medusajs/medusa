import { AxiosRequestConfig } from "axios";
export declare const getClient: <ResponseType_1, RequestType = AxiosRequestConfig<any>>(config: RequestType) => Promise<ResponseType_1>;
