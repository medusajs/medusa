/**
 * Logger interface for the Medusa client.
 */
export type Logger = {
  /**
   * Log error messages.
   */
  error: (...messages: string[]) => void
  /**
   * Log warning messages.
   */
  warn: (...messages: string[]) => void
  /**
   * Log info messages.
   */
  info: (...messages: string[]) => void
  /**
   * Log debug messages.
   */
  debug: (...messages: string[]) => void
}

/**
 * Configuration options for the Medusa client.
 */
export type Config = {
  /**
   * The base URL of the Medusa server.
   */
  baseUrl: string
  /**
   * Default headers to include with every request.
   */
  globalHeaders?: ClientHeaders
  /**
   * The publishable API key for storefront authentication.
   */
  publishableKey?: string
  /**
   * The secret API key for admin authentication.
   */
  apiKey?: string
  /**
   * Authentication configuration.
   */
  auth?: {
    /**
     * The authentication type: "jwt" or "session".
     */
    type?: "jwt" | "session"
    /**
     * The storage key for JWT tokens.
     */
    jwtTokenStorageKey?: string
    /**
     * The storage method for JWT tokens.
     */
    jwtTokenStorageMethod?:
      | "local"
      | "session"
      | "memory"
      | "custom"
      | "nostore"
    /**
     * The credentials mode for fetch requests.
     */
    fetchCredentials?: "include" | "omit" | "same-origin"
    /**
     * Custom storage implementation for JWT tokens.
     */
    storage?: CustomStorage
  }
  /**
   * Custom logger instance.
   */
  logger?: Logger
  /**
   * Whether to enable debug logging.
   */
  debug?: boolean
}

/**
 * A type that can be either a value or a promise resolving to that value.
 */
export type Awaitable<T> = T | Promise<T>

/**
 * Custom storage interface for JWT token storage.
 */
export interface CustomStorage {
  /**
   * Retrieve an item from storage.
   */
  getItem(key: string): Awaitable<string | null>
  /**
   * Store an item in storage.
   */
  setItem(key: string, value: string): Awaitable<void>
  /**
   * Remove an item from storage.
   */
  removeItem(key: string): Awaitable<void>
}

/**
 * Parameters for the native fetch function.
 */
export type FetchParams = Parameters<typeof fetch>

/**
 * Headers object for client requests, with optional caching tags for Next.js.
 */
export type ClientHeaders = Record<
  string,
  | string
  | null
  | {
      /**
       * Tags to cache data under for Next.js applications.
       *
       * Learn more in [Next.js's documentation](https://nextjs.org/docs/app/building-your-application/caching#fetch-optionsnexttags-and-revalidatetag).
       */
      tags: string[]
    }
>

/**
 * Input parameter for fetch operations.
 */
export type FetchInput = FetchParams[0]

/**
 * Arguments for fetch operations with extended options.
 */
export type FetchArgs = Omit<RequestInit, "headers" | "body"> & {
  /**
   * Query parameters to append to the URL.
   */
  query?: Record<string, any>
  /**
   * Request headers.
   */
  headers?: ClientHeaders
  /**
   * Request body data.
   */
  body?: RequestInit["body"] | Record<string, any>
}

/**
 * Client fetch function type.
 */
export type ClientFetch = (
  input: FetchInput,
  init?: FetchArgs
) => Promise<Response>

/**
 * Server-sent event message structure.
 */
export interface ServerSentEventMessage {
  /** Ignored by the client. */
  comment?: string
  /** A string identifying the type of event described. */
  event?: string
  /** The data field for the message. Split by new lines. */
  data?: string
  /** The event ID to set the {@linkcode EventSource} object's last event ID value. */
  id?: string | number
  /** The reconnection time. */
  retry?: number
}

export interface FetchStreamResponse {
  stream: AsyncGenerator<ServerSentEventMessage, void, unknown>
  abort: () => void
}
