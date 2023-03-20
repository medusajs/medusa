import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios"
import { PaypalApiPath, PaypalSdkOptions } from "./types"
import { Logger } from "@medusajs/medusa"

export class PaypalHttpClient {
  protected readonly baseUrl_: string = "https://api-m.paypal.com/v2"
  protected readonly httpClient_: AxiosInstance
  protected readonly options_: PaypalSdkOptions
  protected readonly logger_?: Logger
  protected accessToken_: string

  constructor(options: PaypalSdkOptions) {
    this.options_ = options

    this.logger_ = options.logger

    if (options.useSandbox) {
      this.baseUrl_ = "https://api-m.sandbox.paypal.com"
    }

    const axiosInstance = axios.create({
      baseURL: this.baseUrl_,
    })

    const proxifiyMethodTarget = ["request", "post", "get"]

    this.httpClient_ = new Proxy(axiosInstance, {
      // Handle automatic retry mechanism
      get: (target, prop) => {
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        const original = Reflect.get(...arguments)

        if (proxifiyMethodTarget.includes(prop as string)) {
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
    return await this.httpClient_
      .request({
        method: "POST",
        url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.accessToken_}`,
        },
        data,
      })
      .then((res) => res.data)
  }

  /**
   * Will run the original method and retry it if an unauthorized error is returned
   * @param originalMethod
   * @protected
   */
  protected retryIfNecessary<T = unknown>(originalMethod: Function) {
    return async (...args: unknown[]) => {
      if (!args[args.length - 1]) {
        return
      }

      return await originalMethod
        .apply(this.httpClient_, [...args, false])
        .catch(async (err) => {
          if (err.response.status === 401) {
            await this.authenticate()

            const reqOptions = args[0] as AxiosRequestConfig
            args[0] = {
              ...(reqOptions ?? {}),
              headers: {
                ...(reqOptions?.headers ?? {}),
                Authorization: `Bearer ${this.accessToken_}`,
              },
            }

            return await originalMethod.apply(this.httpClient_, [
              ...args,
              false,
            ])
          }

          this.logger_?.error(err.response.message)
        })
    }
  }

  /**
   * Authenticate and store the access token
   * @protected
   */
  protected async authenticate() {
    const res: { data: { access_token: string } } =
      await this.httpClient_.request({
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

    this.accessToken_ = res.data.access_token
  }
}
