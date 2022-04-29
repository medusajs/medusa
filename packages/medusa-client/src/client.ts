import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosRequestConfig,
} from "axios"
import * as rax from "retry-axios"
import { v4 as uuidv4 } from "uuid"
import * as qs from "qs"

const unAuthenticatedAdminEndpoints = {
  "/admin/auth": "POST",
  "/admin/users/password-token": "POST",
  "/admin/users/reset-password": "POST",
  "/admin/invites/accept": "POST",
}
export interface Config {
  baseUrl: string
  maxRetries: number
  apiKey?: string
}

export type RequestMethod = "DELETE" | "POST" | "GET"

export interface Client {
  request: <RequestType, ResponseType>(
    config: RequestType
  ) => Promise<ResponseType>
}
class AxiosClient implements Client {
  private instance: AxiosInstance
  private config: Config

  constructor(config: Config) {
    this.instance = this.createClient(config)
    this.config = config
  }

  createClient(config: Config): AxiosInstance {
    const client = axios.create({
      baseURL: config.baseUrl,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "comma" }),
    })

    rax.attach(client)

    client.defaults.raxConfig = {
      instance: client,
      retry: config.maxRetries,
      backoffType: "exponential",
      shouldRetry: (err: AxiosError): boolean => {
        const cfg = rax.getConfig(err)
        if (cfg) {
          return this.shouldRetryCondition(
            err,
            cfg.currentRetryAttempt ?? 1,
            cfg.retry ?? 3
          )
        } else {
          return false
        }
      },
    }

    return client
  }

  shouldRetryCondition(
    err: AxiosError,
    numRetries: number,
    maxRetries: number
  ): boolean {
    // Obviously, if we have reached max. retries we stop
    if (numRetries >= maxRetries) {
      return false
    }

    // If no response, we assume a connection error and retry
    if (!err.response) {
      return true
    }

    // Retry on conflicts
    if (err.response.status === 409) {
      return true
    }

    // All 5xx errors are retried
    // OBS: We are currently not retrying 500 requests, since our core needs proper error handling.
    //      At the moment, 500 will be returned on all errors, that are not of type MedusaError.
    if (err.response.status > 500 && err.response.status <= 599) {
      return true
    }

    return false
  }

  normalizeHeaders(obj: AxiosRequestHeaders | undefined): Record<string, any> {
    if (!(obj && typeof obj === "object")) {
      return {}
    }

    return Object.keys(obj).reduce((result, header) => {
      result[this.normalizeHeader(header)] = obj[header]
      return result
    }, {})
  }

  normalizeHeader(header: string): string {
    return header
      .split("-")
      .map(
        (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()
      )
      .join("-")
  }

  requiresAuthentication(path, method): boolean {
    return (
      path.startsWith("/admin") &&
      unAuthenticatedAdminEndpoints[path] !== method
    )
  }

  setHeaders(config: AxiosRequestConfig): AxiosRequestHeaders {
    const { headers, url: path, method } = config
    let defaultHeaders: Record<string, any> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    if (this.config.apiKey && this.requiresAuthentication(path, method)) {
      defaultHeaders = {
        ...defaultHeaders,
        Authorization: `Bearer ${this.config.apiKey}`,
      }
    }

    // only add idempotency key, if we want to retry
    if (this.config.maxRetries > 0 && method === "POST") {
      defaultHeaders["Idempotency-Key"] = uuidv4()
    }

    return Object.assign({}, defaultHeaders, this.normalizeHeaders(headers))
  }

  request<T>(config: AxiosRequestConfig): Promise<T> {
    config = {
      ...config,
      headers: this.setHeaders(config),
    }
    const promise = this.instance({ ...config }).then(({ data }) => data)

    return promise
  }
}

export default AxiosClient
