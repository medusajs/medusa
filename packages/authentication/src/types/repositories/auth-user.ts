import { AuthUser } from "@models"

export type CreateAuthUserDTO = {
  id?: string
  email: string
  password_hash?: string
  provider_id?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export type UpdateAuthUserDTO = {
  update: {
    id: string
    email?: string
    password_hash?: string
    user_metadata?: Record<string, unknown>
    app_metadata?: Record<string, unknown>
  }
  user: AuthUser
}
