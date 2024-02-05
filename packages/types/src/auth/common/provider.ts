export type AuthenticationResponse = {
  success: boolean
  authUser?: any
  error?: string
  location?: string
}

export type AuthModuleProviderConfig = {
  name: string
  scopes: Record<string, AuthProviderScope>
}

export type AuthProviderScope = Record<string, unknown>

export type AuthenticationInput = {
  url: string
  headers: Record<string, string>
  query: Record<string, string>
  body: Record<string, string>
  authScope: string
  protocol: string
}
