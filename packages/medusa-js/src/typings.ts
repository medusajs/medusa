import { AxiosResponse } from "axios"

export type Response<T> = T & {
  response: Omit<AxiosResponse<T>, "data">
}

export type ResponsePromise<T = any> = Promise<Response<T>>
