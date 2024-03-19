export type ApiMethod = "GET" | "POST" | "DELETE"
export type ApiAuthType = "api_token" | "jwt" | "cookie_sid"

export type ApiDataOptions = Record<string, unknown>

export type ApiTestingOptions = {
  method: ApiMethod
  url: string
  authType?: ApiAuthType
  authValue?: string
  pathData?: ApiDataOptions
  queryData?: ApiDataOptions
  bodyData?: ApiDataOptions
}
