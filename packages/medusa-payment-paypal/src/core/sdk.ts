import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { CreateOrder, PAYPAL_API_PATH, PaypalSdkOptions } from "./types"
import { Logger } from "@medusajs/medusa"

export class PaypalSdk {
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
   * Create a new order
   * @param data
   */
  async createOrder(data: CreateOrder) {
    return await this.httpClient_
      .request({
        method: "POST",
        url: PAYPAL_API_PATH.CREATE_ORDER,
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
        url: PAYPAL_API_PATH.AUTH,
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

  /* async get() {}*/
  /* async patch() {}*/
}

/* class PaypalPaymentSdk {
  constructor() {}

  /!* async capturesRefund() {}*!/
  /!* async authorizationVoid() {}*!/
  /!* async authorizationCapture() {}*!/
}*/
