export interface RequestOptions {
  apiKey?: string;
  timeout?: number;
  numberOfRetries?: number;
}

export type Response<T> = T & {
  headers: {
    [key: string]: string;
  };
};

export type AsyncResult<T> = Promise<Response<T>>;

export type RequestMethod = 'DELETE' | 'POST' | 'GET';
