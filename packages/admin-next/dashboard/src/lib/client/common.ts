const baseUrl = "http://localhost:9000"

const commonHeaders: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
}

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? new URLSearchParams(query).toString() : null

  return `${baseUrl}${path}${params ? `?${params}` : ""}`
}

function getOptions(options?: RequestInit): RequestInit {
  return {
    ...options,
    headers: {
      ...commonHeaders,
      ...options?.headers,
    },
    credentials: "include",
  }
}

export async function makeRequest<
  R,
  Q extends Record<string, any> | undefined = undefined,
>(path: string, query?: Q, options?: RequestInit): Promise<R> {
  const url = getUrl(path, query)
  const requestOptions = getOptions(options)

  const response = await fetch(url, requestOptions)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`API error ${response.status}: ${errorData.message}`)
  }

  return response.json()
}
