import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios"
import axiosRetry from "axios-retry"

export type ClientArgs = {
  accessToken: string
  baseURL: string
  maxRetries?: number
}

class Client {
  private _axios: AxiosInstance

  constructor({ accessToken, baseURL, maxRetries = 3 }: ClientArgs) {
    const instance = axios.create({
      baseURL,
      headers: {
        "X-FIGMA-TOKEN": accessToken,
      },
    })

    // Typecast to any because our monorepo is using an older version of axios-retry and axios
    axiosRetry(instance as any, {
      retries: maxRetries,
      retryDelay: axiosRetry.exponentialDelay,
    })

    this._axios = instance
  }

  async request(
    method: Method,
    url: string,
    payload: Record<string, any> = {},
    config?: AxiosRequestConfig
  ) {
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      ...config,
    }

    if (["POST", "DELETE"].includes(method)) {
      requestConfig.data = payload
    }

    const response = await this._axios.request(requestConfig)

    if (Math.floor(response.status / 100) !== 2) {
      throw response.statusText
    }

    return response.data
  }
}

export default Client
