import { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosRequestConfig } from "axios";
export interface Config {
    baseUrl: string;
    maxRetries: number;
    apiKey?: string;
}
export declare type RequestMethod = "DELETE" | "POST" | "GET";
export interface Client {
    request: <RequestType, ResponseType>(config: RequestType) => Promise<ResponseType>;
}
declare class AxiosClient implements Client {
    private instance;
    private config;
    constructor(config: Config);
    createClient(config: Config): AxiosInstance;
    shouldRetryCondition(err: AxiosError, numRetries: number, maxRetries: number): boolean;
    normalizeHeaders(obj: AxiosRequestHeaders | undefined): Record<string, any>;
    normalizeHeader(header: string): string;
    requiresAuthentication(path: any, method: any): boolean;
    setHeaders(config: AxiosRequestConfig): AxiosRequestHeaders;
    request<T>(config: AxiosRequestConfig): Promise<T>;
}
export default AxiosClient;
