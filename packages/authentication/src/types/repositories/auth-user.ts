export type CreateAuthUserDTO = {
  id?: string
  email: string
  password_hash?: string
  provider_id?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export type UpdateAuthUserDTO = {
  id: string
  email?: string
  password_hash?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}
