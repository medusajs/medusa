export interface CreateInviteDTO {
  email: string
  accepted?: boolean
  metadata?: Record<string, unknown> | null
}
