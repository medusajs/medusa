export interface CreateUserDTO {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  metadata?: Record<string, unknown>
}
export interface UpdateUserDTO {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  metadata?: Record<string, unknown>
}

export interface CreateInviteDTO {
  id?: string
  email?: string
  accepted?: boolean
  token: string
  expires_at: Date
  metadata?: Record<string, unknown>
}

export interface UpdateInviteDTO {
  id: string
  email?: string
  accepted?: boolean
  token?: string
  expires_at?: Date
  metadata?: Record<string, unknown>
}
