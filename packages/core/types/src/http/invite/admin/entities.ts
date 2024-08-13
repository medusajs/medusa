export interface AdminInvite {
  id: string
  email: string
  accepted: boolean
  token: string
  expires_at?: Date
  metadata?: Record<string, unknown>
  created_at?: Date
  updated_at?: Date
}