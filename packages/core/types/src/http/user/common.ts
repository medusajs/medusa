export type BaseUserResponse = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
