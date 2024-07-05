import { Logger } from "@medusajs/medusa"
import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios"
import {
  PaypalApiPath,
  PaypalEnvironmentPaths,
  PaypalSdkOptions,
} from "./types"

const MAX_ATTEMPTS = 2

export class PaypalHttpClient {
  protected readonly baseUrl_: string = PaypalEnvironmentPaths.LIVE
  protected readonly httpClient_: AxiosInstance
  protected readonly options_: PaypalSdkOptions
  protected readonly logger_?: Logger
  protected accessToken_: string

  constructor(options: PaypalSdkOptions) {
    this.options_ = options

    this.logger_ = options.logger

    if (options.sandbox) {
      this.baseUrl_ = PaypalEnvironmentPaths.SANDBOX
    }

    const axiosInstance = axios.create({
      baseURL: this.baseUrl_,
    })

    this.httpClient_ = new Proxy(axiosInstance, {
      // Handle automatic retry mechanism
      get: (target, prop) => {
        return this.retryIfNecessary(target[prop].bind(target))
      },
    })
  }

  /**
   * Run a request and return the result
   * @param url
   * @param data
   * @param method
   * @protected
   */
  async request<T, TResponse>({
    url,
    data,
    method,
  }: {
    url: string
    data?: T
    method?: Method
  }): Promise<TResponse> {
    return await this.httpClient_.request({
      method: method ?? "POST",
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken_}`,
      },
      data,
    })
  }

  /**
   * Will run the original method and retry it if an unauthorized error is returned
   * @param originalMethod
   * @protected
   */
  protected retryIfNecessary<T = unknown>(originalMethod: Function) {
    return async (config, originalConfig, retryCount = 0) => {
      if (retryCount > MAX_ATTEMPTS) {
        throw new Error(
          `An error occurred while requesting Paypal API after ${MAX_ATTEMPTS} attempts`
        )
      }

      return await originalMethod
        .apply(this.httpClient_, [config, originalConfig, retryCount])
        .then((res) => res.data)
        .catch(async (err) => {
          if (err.response?.status === 401) {
            ++retryCount

            if (!originalConfig) {
              originalConfig = config
            }

            await this.authenticate(originalConfig, retryCount)

            config = {
              ...(originalConfig ?? {}),
              headers: {
                ...(originalConfig?.headers ?? {}),
                Authorization: `Bearer ${this.accessToken_}`,
              },
            }

            return await originalMethod
              .apply(this.httpClient_, [config])
              .then((res) => res.data)
          }

          this.logger_?.error(err.response.message)
          throw err
        })
    }
  }

  /**
   * Authenticate and store the access token
   * @protected
   */
  protected async authenticate(
    originalConfig?: AxiosRequestConfig,
    retryCount = 0
  ) {
    const res: { access_token: string } = await (
      this.httpClient_.request as any
    )(
      {
        method: "POST",
        url: PaypalApiPath.AUTH,
        auth: {
          username: this.options_.clientId ?? this.options_.client_id,
          password: this.options_.clientSecret ?? this.options_.client_secret,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type: "client_credentials",
        },
      },
      originalConfig,
      retryCount
    )

    this.accessToken_ = res.access_token
  }
}
