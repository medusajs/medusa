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

export type AuthProviderScope = Record<string, string>

export type AuthenticationInput = {
  connection: { encrypted: boolean }
  url: string
  headers: Record<string, string>
  query: Record<string, string>
  body: Record<string, string>
  scope: string
}
