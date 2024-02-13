export interface CreateUserDTO {
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  metadata?: Record<string, unknown>
}
export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, "email">> {
  id: string
}

export interface CreateInviteDTO {
  email?: string
  accepted?: boolean
  token: string
  expires_at: Date
  metadata?: Record<string, unknown>
}

export interface UpdateInviteDTO extends Partial<CreateInviteDTO> {
  id: string
}
