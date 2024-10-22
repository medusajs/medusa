export type Logger = {
  error: (...messages: string[]) => void
  warn: (...messages: string[]) => void
  info: (...messages: string[]) => void
  debug: (...messages: string[]) => void
}

export type Config = {
  baseUrl: string
  globalHeaders?: ClientHeaders
  publishableKey?: string
  apiKey?: string
  auth?: {
    type?: "jwt" | "session"
    jwtTokenStorageKey?: string
    jwtTokenStorageMethod?: "local" | "session" | "memory" | "nostore"
  }
  logger?: Logger
  debug?: boolean
}

export type FetchParams = Parameters<typeof fetch>

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

export type FetchInput = FetchParams[0]

export type FetchArgs = Omit<RequestInit, "headers" | "body"> & {
  query?: Record<string, any>
  headers?: ClientHeaders
  body?: RequestInit["body"] | Record<string, any>
}

export type ClientFetch = (
  input: FetchInput,
  init?: FetchArgs
) => Promise<Response>

// Defined in deno's standard library, and returned by fetch-event-stream package.
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
  stream: AsyncGenerator<ServerSentEventMessage, void, unknown> | null
  abort: () => void
}
