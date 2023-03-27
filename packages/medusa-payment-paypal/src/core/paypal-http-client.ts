import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios"
import {
  PaypalApiPath,
  PaypalEnvironmentPaths,
  PaypalSdkOptions,
} from "./types"
import { Logger } from "@medusajs/medusa"

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
      const hasRetried = typeof args[args.length - 1] === "number"
      let retryCount = hasRetried ? (args[args.length - 1] as number) : 0

      if (retryCount >= 2) {
        throw new Error(
          "An error occurred while requesting Paypal API after two attempts"
        )
      }

      const config = args[0] as AxiosRequestConfig

      const argumentsList = hasRetried ? args.slice(0, -1) : args

      return await originalMethod
        .apply(this.httpClient_, [...argumentsList, retryCount])
        .then((res) => res.data)
        .catch(async (err) => {
          if (
            config.url !== PaypalApiPath.AUTH &&
            err.response?.status === 401
          ) {
            ++retryCount
            await this.authenticate(retryCount)

            const axiosRequestConfig = args[0] as AxiosRequestConfig
            args[0] = {
              ...(axiosRequestConfig ?? {}),
              headers: {
                ...(axiosRequestConfig?.headers ?? {}),
                Authorization: `Bearer ${this.accessToken_}`,
              },
            }

            return await originalMethod
              .apply(this.httpClient_, [...argumentsList, retryCount])
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
  protected async authenticate(retryCount = 0) {
    const res: { access_token: string } = await (
      this.httpClient_.request as any
    )(
      {
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
      },
      retryCount
    )

    this.accessToken_ = res.access_token
  }
}
