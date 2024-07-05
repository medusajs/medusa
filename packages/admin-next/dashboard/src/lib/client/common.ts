import { stringify } from "qs"

const baseUrl = "http://localhost:9000"

const commonHeaders: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? stringify(query) : null

  return `${baseUrl}${path}${params ? `?${params}` : ""}`
}

function getBody(payload?: Record<string, any>) {
  return payload ? JSON.stringify(payload) : undefined
}

function getOptions(
  options?: Omit<RequestInit, "body">,
  payload?: Record<string, any>
): RequestInit {
  const body = getBody(payload)

  return {
    ...options,
    headers: {
      ...commonHeaders,
      ...options?.headers,
    },
    body,
    credentials: "include",
  }
}

async function makeRequest<
  TRes,
  TPayload extends Record<string, any> | undefined,
  TQuery extends Record<string, any> | undefined = undefined,
>(
  path: string,
  payload?: TPayload,
  query?: TQuery,
  options?: Omit<RequestInit, "body">
): Promise<TRes> {
  const url = getUrl(path, query)
  const requestOptions = getOptions(options, payload)

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    const errorData = await response.json()
    // Temp: Add a better error type
    throw new Error(`API error ${response.status}: ${errorData.message}`)
  }

  return response.json()
}

export async function getRequest<
  TRes,
  TQuery extends Record<string, any> | undefined = {},
>(
  path: string,
  query?: TQuery,
  options?: Omit<RequestInit, "body" | "method">
): Promise<TRes> {
  return makeRequest<TRes, undefined, Record<string, any>>(
    path,
    undefined,
    query,
    {
      ...options,
      method: "GET",
    }
  )
}

export async function postRequest<
  TRes,
  TPayload extends Record<string, any> | undefined = {},
>(
  path: string,
  payload?: TPayload,
  options?: Omit<RequestInit, "body" | "method">
): Promise<TRes> {
  return makeRequest<TRes, Record<string, any>, undefined>(
    path,
    payload,
    undefined,
    {
      ...options,
      method: "POST",
    }
  )
}

export async function deleteRequest<TRes>(
  path: string,
  options?: Omit<RequestInit, "body" | "method">
): Promise<TRes> {
  return makeRequest<TRes, undefined, undefined>(path, undefined, undefined, {
    ...options,
    method: "DELETE",
  })
}
