import { AuthUser } from "@models"

export type CreateAuthUserDTO = {
  provider_id: string
  entity_id: string
  provider_metadata?: Record<string, unknown>
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export type UpdateAuthUserDTO = {
  update: {
    id: string
    provider_metadata?: Record<string, unknown>
    user_metadata?: Record<string, unknown>
    app_metadata?: Record<string, unknown>
  }
  user: AuthUser
}
