import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios"
import {
  PaypalApiPath,
  PaypalEnvironmentPaths,
  PaypalSdkOptions,
} from "./types"
import { Logger } from "@medusajs/medusa"
import { PaypalOptions } from "../types"

export class PaypalHttpClient {
  protected readonly baseUrl_: string = PaypalEnvironmentPaths.LIVE
  protected readonly httpClient_: AxiosInstance
  protected readonly options_: PaypalSdkOptions
  protected readonly logger_?: Logger
  protected accessToken_: string

  constructor(options: PaypalOptions & { logger?: Logger }) {
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
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        const original = Reflect.get(...arguments)

        if ("request" === (prop as string)) {
          return this.retryIfNecessary(original)
        }

        return original
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
    return async (...args: unknown[]) => {
      // Explicitly check false equality to avoid matching another type object
      // if the value is not present
      const shouldRetry = !(args[args.length - 1] === false)

      if (!shouldRetry) {
        return
      }

      return await originalMethod
        .apply(this.httpClient_, [...args])
        .then((res) => res.data)
        .catch(async (err) => {
          if (err.response.status === 401) {
            await this.authenticate()

            const axiosRequestConfig = args[0] as AxiosRequestConfig
            args[0] = {
              ...(axiosRequestConfig ?? {}),
              headers: {
                ...(axiosRequestConfig?.headers ?? {}),
                Authorization: `Bearer ${this.accessToken_}`,
              },
            }

            return await originalMethod
              .apply(this.httpClient_, [...args, false])
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
  protected async authenticate() {
    const res: { access_token: string } = await this.httpClient_.request({
      method: "POST",
      url: PaypalApiPath.AUTH,
      auth: {
        username: this.options_.clientId,
        password: this.options_.clientSecret,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        grant_type: "client_credentials",
      },
    })

    this.accessToken_ = res.access_token
  }
}
