import axios, { AxiosPromise, AxiosRequestConfig } from "axios"

export function medusaRequest(
    storeURL: string,
    path = "",
    headers = {}
  ): AxiosPromise {
    const options: AxiosRequestConfig = {
      method: "GET",
      withCredentials: true,
      url: path,
      headers: headers,
    }
  
    const client = axios.create({ baseURL: storeURL })
  
    return client(options)
  }