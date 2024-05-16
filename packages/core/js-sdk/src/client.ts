import qs from "qs"
import { ClientFetch, Config, FetchArgs, FetchInput, Logger } from "./types"

const isBrowser = () => typeof window !== "undefined"

const toBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    return window.btoa(str)
  }

  return Buffer.from(str).toString("base64")
}

const sanitizeHeaders = (headers: Headers) => {
  return {
    ...Object.fromEntries(headers.entries()),
    Authorization: "<REDACTED>",
  }
}

const normalizeRequest = (
  init: FetchArgs | undefined,
  headers: Headers
): RequestInit | undefined => {
  let body = init?.body
  if (body && headers.get("content-type")?.includes("application/json")) {
    body = JSON.stringify(body)
  }

  return {
    ...init,
    headers,
    ...(body ? { body: body as RequestInit["body"] } : {}),
  } as RequestInit
}

const normalizeResponse = async (resp: Response, reqHeaders: Headers) => {
  if (resp.status >= 300) {
    const error = new FetchError(resp.statusText, resp.status)
    throw error
  }

  // If we both requested JSON, we try to parse. Otherwise, we return the raw response.
  const isJsonRequest = reqHeaders.get("accept")?.includes("application/json")
  return isJsonRequest ? await resp.json() : resp
}

export class FetchError extends Error {
  status: number | undefined

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

export class Client {
  public fetch_: ClientFetch
  private logger: Logger

  private DEFAULT_JWT_STORAGE_KEY = "medusa_auth_token"
  private token = ""

  constructor(config: Config) {
    const logger = config.logger || {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
    }

    this.logger = {
      ...logger,
      debug: config.debug ? logger.debug : () => {},
    }

    this.fetch_ = this.initClient(config)
  }

  // Since the response is dynamically determined, we cannot know if it is JSON or not. Therefore, it is important to pass `Response` as the return type
  fetch<T extends any>(input: FetchInput, init?: FetchArgs): Promise<T> {
    return this.fetch_(input, init) as unknown as Promise<T>
  }

  protected initClient(config: Config): ClientFetch {
    const defaultHeaders = new Headers({
      "content-type": "application/json",
      accept: "application/json",
      ...this.getApiKeyHeader(config),
      ...this.getPublishableKeyHeader(config),
    })

    this.logger.debug(
      "Initiating Medusa client with default headers:\n",
      `${JSON.stringify(sanitizeHeaders(defaultHeaders), null, 2)}\n`
    )

    return (input: FetchInput, init?: FetchArgs) => {
      // We always want to fetch the up-to-date JWT token before firing off a request.
      const headers = new Headers(defaultHeaders)
      const customHeaders = {
        ...config.globalHeaders,
        ...this.getJwtTokenHeader(config),
        ...init?.headers,
      }
      // We use `headers.set` in order to ensure headers are overwritten in a case-insensitive manner.
      Object.entries(customHeaders).forEach(([key, value]) => {
        headers.set(key, value)
      })

      let normalizedInput: RequestInfo | URL = input
      if (input instanceof URL || typeof input === "string") {
        normalizedInput = new URL(input, config.baseUrl)
        if (init?.query) {
          const existing = qs.parse(normalizedInput.search)
          const stringifiedQuery = qs.stringify({ existing, ...init.query })
          normalizedInput.search = stringifiedQuery
        }
      }

      this.logger.debug(
        "Performing request to:\n",
        `URL: ${normalizedInput.toString()}\n`,
        `Headers: ${JSON.stringify(sanitizeHeaders(headers), null, 2)}\n`
      )

      // Any non-request errors (eg. invalid JSON in the response) will be thrown as-is.
      return fetch(normalizedInput, normalizeRequest(init, headers)).then(
        (resp) => {
          this.logger.debug(`Received response with status ${resp.status}\n`)
          return normalizeResponse(resp, headers)
        }
      )
    }
  }

  protected getApiKeyHeader = (
    config: Config
  ): { Authorization: string } | {} => {
    return config.apiKey
      ? { Authorization: "Basic " + toBase64(config.apiKey + ":") }
      : {}
  }

  protected getPublishableKeyHeader = (
    config: Config
  ): { "x-medusa-pub-key": string } | {} => {
    return config.publishableKey
      ? { "x-medusa-pub-key": config.publishableKey }
      : {}
  }

  protected getJwtTokenHeader = (
    config: Config
  ): { Authorization: string } | {} => {
    const storageMethod =
      config.jwtToken?.storageMethod || (isBrowser() ? "local" : "memory")
    const storageKey =
      config.jwtToken?.storageKey || this.DEFAULT_JWT_STORAGE_KEY

    switch (storageMethod) {
      case "local": {
        if (!isBrowser()) {
          throw new Error("Local JWT storage is only available in the browser")
        }
        const token = window.localStorage.getItem(storageKey)
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
      case "session": {
        if (!isBrowser()) {
          throw new Error(
            "Session JWT storage is only available in the browser"
          )
        }
        const token = window.sessionStorage.getItem(storageKey)
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
      case "memory": {
        return this.token ? { Authorization: `Bearer ${this.token}` } : {}
      }
    }
  }
}
