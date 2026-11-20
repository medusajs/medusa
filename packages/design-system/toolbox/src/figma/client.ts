import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from "axios"

const IDEMPOTENT_METHODS = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"]

export type ClientArgs = {
  accessToken: string
  baseURL: string
  maxRetries?: number
}

class Client {
  private _axios: AxiosInstance
  private _maxRetries: number

  constructor({ accessToken, baseURL, maxRetries = 3 }: ClientArgs) {
    this._axios = axios.create({
      baseURL,
      headers: {
        "X-FIGMA-TOKEN": accessToken,
      },
    })
    this._maxRetries = maxRetries
  }

  private isRetryable(error: AxiosError, method: Method) {
    if (error.code === "ECONNABORTED") {
      return false
    }

    if (!error.response) {
      return Boolean(error.code)
    }

    const { status } = error.response
    const isServerError = status === 429 || (status >= 500 && status <= 599)

    return isServerError && IDEMPOTENT_METHODS.includes(method.toUpperCase())
  }

  private async requestWithRetry(config: AxiosRequestConfig, method: Method) {
    for (let retry = 1; ; retry++) {
      try {
        return await this._axios.request(config)
      } catch (error) {
        if (
          retry > this._maxRetries ||
          !axios.isAxiosError(error) ||
          !this.isRetryable(error, method)
        ) {
          throw error
        }
        const delay = 2 ** retry * 100
        await new Promise((resolve) =>
          setTimeout(resolve, delay + Math.random() * delay * 0.2)
        )
      }
    }
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

    const response = await this.requestWithRetry(requestConfig, method)

    if (Math.floor(response.status / 100) !== 2) {
      throw response.statusText
    }

    return response.data
  }
}

export default Client
