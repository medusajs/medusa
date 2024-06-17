export interface AcceptInviteWorkflowInputDTO {
  invite_token: string
  auth_identity_id: string
  user: {
    email?: string
    first_name?: string | null
    last_name?: string | null
    avatar_url?: string | null
    metadata?: Record<string, unknown> | null
  }
}
