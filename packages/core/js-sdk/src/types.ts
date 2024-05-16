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
  jwtToken?: {
    storageKey?: string
    // TODO: Add support for cookie storage
    storageMethod?: "local" | "session" | "memory"
  }
  logger?: Logger
  debug?: boolean
}

export type FetchParams = Parameters<typeof fetch>

export type ClientHeaders = Record<string, string>

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
