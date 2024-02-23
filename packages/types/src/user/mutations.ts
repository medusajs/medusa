export interface CreateUserDTO {
  email: string
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
  metadata?: Record<string, unknown> | null
}

export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, "email">> {
  id: string
}

export interface CreateInviteDTO {
  email: string
  accepted?: boolean
  metadata?: Record<string, unknown> | null
}

export interface UpdateInviteDTO
  extends Partial<Omit<CreateInviteDTO, "email">> {
  id: string
}
