export interface AcceptInviteWorkflowInputDTO {
  invite_token: string
  auth_user_id: string
  user: {
    email?: string
    first_name?: string | null
    last_name?: string | null
    avatar_url?: string | null
    metadata?: Record<string, unknown> | null
  }
}
