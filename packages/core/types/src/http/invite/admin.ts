export type AdminAcceptInvite = {
  first_name: string
  last_name: string
}

export type AdminCreateInvite = {
  email: string
  metadata?: Record<string, unknown>
}

export type AdminInviteResponse = {
  id: string
  email: string
  accepted: boolean
  token: string
  expires_at?: Date
  metadata?: Record<string, unknown>
  created_at?: Date
  updated_at?: Date
}
