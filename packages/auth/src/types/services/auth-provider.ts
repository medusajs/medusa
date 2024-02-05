export type AuthProviderDTO = {
  provider: string
  name: string
  scope: string
  is_active: boolean
  config: Record<string, unknown>
}

export type CreateAuthProviderDTO = {
  provider: string
  name: string
  scope?: string
  is_active?: boolean
  config?: Record<string, unknown>
}

export type UpdateAuthProviderDTO = {
  provider: string
  name?: string
  is_active?: boolean
  config?: Record<string, unknown>
}

export type FilterableAuthProviderProps = {}
