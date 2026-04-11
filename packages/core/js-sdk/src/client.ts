import { events } from "fetch-event-stream"
import { stringify } from "qs"
import {
  ClientFetch,
  Config,
  FetchArgs,
  FetchInput,
  FetchStreamResponse,
  Logger,
} from "./types"

export const PUBLISHABLE_KEY_HEADER = "x-publishable-api-key"
export const LOCALE_STORAGE_KEY = "medusa_locale"

// We want to explicitly retrieve the base URL instead of relying on relative paths that differ in behavior between browsers.
const getBaseUrl = (passedBaseUrl: string) => {
  if (typeof window === "undefined") {
    return passedBaseUrl
  }

  // If the passed base URL is empty or "/", we use the current origin from the browser.
  if (passedBaseUrl === "" || passedBaseUrl === "/") {
    return window.location.origin
  }

  return passedBaseUrl
}

const hasStorage = (storage: "localStorage" | "sessionStorage") => {
  if (typeof window !== "undefined") {
    return storage in window
  }

  return false
}

const toBase64 = (str: string) => {
  if (typeof window !== "undefined") {
    return window.btoa(str)
  }

  return Buffer.from(str).toString("base64")
}

const sanitizeHeaders = (headers: Headers) => {
  return {
    ...Object.fromEntries(headers.entries()),
    authorization: "<REDACTED>",
  }
}

const normalizeRequest = (
  init: FetchArgs | undefined,
  headers: Headers,
  config: Config
): RequestInit | undefined => {
  let body = init?.body
  if (body && headers.get("content-type")?.includes("application/json")) {
    body = JSON.stringify(body)
  }

  // "credentials" is not supported in some environments (eg. on the backend), and it might throw an exception if the field is set.
  const isFetchCredentialsSupported = "credentials" in Request.prototype

  // Oftentimes the server will be on a different origin, so we want to default to include
  // Note that the cookie's SameSite attribute takes precedence over this setting.
  const credentials =
    config.auth?.type === "session"
      ? config.auth?.fetchCredentials || "include"
      : "omit"

  return {
    ...init,
    headers,
    credentials: isFetchCredentialsSupported ? credentials : undefined,
    ...(body ? { body: body as RequestInit["body"] } : {}),
  } as RequestInit
}

const normalizeResponse = async (resp: Response, reqHeaders: Headers) => {
  if (resp.status >= 300) {
    const jsonError = (await resp.json().catch(() => ({}))) as {
      message?: string
    }
    throw new FetchError(
      jsonError.message ?? resp.statusText,
      resp.statusText,
      resp.status
    )
  }

  // If we requested JSON, we try to parse the response. Otherwise, we return the raw response.
  const isJsonRequest = reqHeaders.get("accept")?.includes("application/json")
  return isJsonRequest ? await resp.json() : resp
}

export class FetchError extends Error {
  status: number | undefined
  statusText: string | undefined

  constructor(message: string, statusText?: string, status?: number) {
    super(message)
    this.statusText = statusText
    this.status = status
  }
}

export class Client {
  public fetch_: ClientFetch
  private config: Config
  private logger: Logger

  private DEFAULT_JWT_STORAGE_KEY = "medusa_auth_token"
  private token = ""

  private locale_ = ""

  get locale() {
    if (hasStorage("localStorage")) {
      const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
      if (storedLocale) {
        return storedLocale
      }
    }
    return this.locale_
  }

  constructor(config: Config) {
    this.config = { ...config, baseUrl: getBaseUrl(config.baseUrl) }
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

    if (hasStorage("localStorage")) {
      this.locale_ = window.localStorage.getItem(LOCALE_STORAGE_KEY) || ""
    }

    this.fetch_ = this.initClient()
  }

  setLocale(locale: string) {
    if (!window) {
      this.logger.warn(
        "setLocale is not available in the server environment. Please set the locale directly through the 'x-medusa-locale' header."
      )
      return
    }

    if (hasStorage("localStorage")) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    }

    this.locale_ = locale
  }

  /**
   * `fetch` closely follows (and uses under the hood) the native `fetch` API. There are, however, few key differences:
   * - Non 2xx statuses throw a `FetchError` with the status code as the `status` property, rather than resolving the promise
   * - You can pass `body` and `query` as objects, and they will be encoded and stringified.
   * - The response gets parsed as JSON if the `accept` header is set to `application/json`, otherwise the raw Response object is returned
   *
   * Since the response is dynamically determined, we cannot know if it is JSON or not. Therefore, it is important to pass `Response` as the return type
   *
   * @param input: FetchInput
   * @param init: FetchArgs
   * @returns Promise<T>
   */
  fetch<T extends any>(input: FetchInput, init?: FetchArgs): Promise<T> {
    return this.fetch_(input, init) as unknown as Promise<T>
  }

  /**
   * `fetchStream` is a helper method to deal with server-sent events. It returns an object with a stream and an abort function.
   * It follows a very similar interface to `fetch`, with the return value being an async generator.
   * The stream is an async generator that yields `ServerSentEventMessage` objects, which contains the event name, stringified data, and few other properties.
   * The caller is responsible for handling `disconnect` events and aborting the stream. The caller is also responsible for parsing the data field.
   *
   * @param input: FetchInput
   * @param init: FetchArgs
   * @returns FetchStreamResponse
   */
  async fetchStream(
    input: FetchInput,
    init?: FetchArgs
  ): Promise<FetchStreamResponse> {
    const abortController = new AbortController()
    const abortFunc = abortController.abort.bind(abortController)

    let res = await this.fetch_(input, {
      ...init,
      signal: abortController.signal,
      headers: { ...init?.headers, accept: "text/event-stream" },
    })

    if (res.ok) {
      return { stream: events(res, abortController.signal), abort: abortFunc }
    }

    return { stream: null, abort: abortFunc }
  }

  async setToken(token: string) {
    await this.setToken_(token)
  }

  async getToken() {
    return await this.getToken_()
  }

  async clearToken() {
    await this.clearToken_()
  }

  protected async clearToken_() {
    const { storageMethod, storageKey } = this.getTokenStorageInfo_()
    switch (storageMethod) {
      case "local": {
        window.localStorage.removeItem(storageKey)
        break
      }
      case "session": {
        window.sessionStorage.removeItem(storageKey)
        break
      }
      case "custom": {
        await this.config.auth?.storage?.removeItem(storageKey)
        break
      }
      case "memory": {
        this.token = ""
        break
      }
    }
  }

  protected initClient(): ClientFetch {
    const defaultHeaders = new Headers({
      "content-type": "application/json",
      accept: "application/json",
      ...this.getApiKeyHeader_(),
      ...this.getPublishableKeyHeader_(),
    })

    this.logger.debug(
      "Initiating Medusa client with default headers:\n",
      `${JSON.stringify(sanitizeHeaders(defaultHeaders), null, 2)}\n`
    )

    return async (input: FetchInput, init?: FetchArgs) => {
      // We always want to fetch the up-to-date JWT token before firing off a request.
      const headers = new Headers(defaultHeaders)

      if (this.locale) {
        headers.set("x-medusa-locale", this.locale)
      }

      const customHeaders = {
        "x-medusa-locale": this.locale,
        ...this.config.globalHeaders,
        ...(await this.getJwtHeader_()),
        ...init?.headers,
      }

      // We use `headers.set` in order to ensure headers are overwritten in a case-insensitive manner.
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (value === null) {
          headers.delete(key)
        } else {
          headers.set(key, value)
        }
      })

      let normalizedInput: RequestInfo | URL = input
      if (input instanceof URL || typeof input === "string") {
        const baseUrl = new URL(this.config.baseUrl)
        const fullPath = `${baseUrl.pathname.replace(/\/$/, "")}/${input
          .toString()
          .replace(/^\//, "")}`
        normalizedInput = new URL(fullPath, baseUrl.origin)
        if (init?.query) {
          const params = Object.fromEntries(
            normalizedInput.searchParams.entries()
          )
          const stringifiedQuery = stringify(
            { ...params, ...init.query },
            { skipNulls: true }
          )
          normalizedInput.search = stringifiedQuery
        }
      }

      this.logger.debug(
        "Performing request to:\n",
        `URL: ${normalizedInput.toString()}\n`,
        `Headers: ${JSON.stringify(sanitizeHeaders(headers), null, 2)}\n`
      )

      // Any non-request errors (eg. invalid JSON in the response) will be thrown as-is.
      return await fetch(
        normalizedInput,
        normalizeRequest(init, headers, this.config)
      ).then((resp) => {
        this.logger.debug(`Received response with status ${resp.status}\n`)
        return normalizeResponse(resp, headers)
      })
    }
  }

  protected getApiKeyHeader_ = (): { Authorization: string } | {} => {
    return this.config.apiKey
      ? { Authorization: "Basic " + toBase64(this.config.apiKey + ":") }
      : {}
  }

  protected getPublishableKeyHeader_ = ():
    | { [PUBLISHABLE_KEY_HEADER]: string }
    | {} => {
    return this.config.publishableKey
      ? { [PUBLISHABLE_KEY_HEADER]: this.config.publishableKey }
      : {}
  }

  protected async getJwtHeader_(): Promise<{ Authorization: string } | {}> {
    // If the user has requested for session storage, we don't want to send the JWT token in the header.
    if (this.config.auth?.type === "session") {
      return {}
    }

    const token = await this.getToken_()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  protected async setToken_(token: string) {
    const { storageMethod, storageKey } = this.getTokenStorageInfo_()
    switch (storageMethod) {
      case "local": {
        window.localStorage.setItem(storageKey, token)
        break
      }
      case "session": {
        window.sessionStorage.setItem(storageKey, token)
        break
      }
      case "custom": {
        await this.config.auth?.storage?.setItem(storageKey, token)
        break
      }
      case "memory": {
        this.token = token
        break
      }
    }
  }

  protected async getToken_() {
    const { storageMethod, storageKey } = this.getTokenStorageInfo_()
    switch (storageMethod) {
      case "local": {
        return window.localStorage.getItem(storageKey)
      }
      case "session": {
        return window.sessionStorage.getItem(storageKey)
      }
      case "custom": {
        return await this.config.auth?.storage?.getItem(storageKey)
      }
      case "memory": {
        return this.token
      }
    }

    return null
  }

  protected getTokenStorageInfo_ = () => {
    const hasLocal = hasStorage("localStorage")
    const hasSession = hasStorage("sessionStorage")
    const hasCustom = Boolean(this.config.auth?.storage)

    const storageMethod =
      this.config.auth?.jwtTokenStorageMethod ||
      (hasLocal ? "local" : "nostore")
    const storageKey =
      this.config.auth?.jwtTokenStorageKey || this.DEFAULT_JWT_STORAGE_KEY

    if (!hasLocal && storageMethod === "local") {
      this.throwError_("Local JWT storage is only available in the browser")
    }
    if (!hasSession && storageMethod === "session") {
      this.throwError_("Session JWT storage is only available in the browser")
    }
    if (!hasCustom && storageMethod === "custom") {
      this.throwError_("Custom storage was not provided in the config")
    }

    return {
      storageMethod,
      storageKey,
    }
  }

  protected throwError_(message: string) {
    this.logger.error(message)
    throw new Error(message)
  }
}
