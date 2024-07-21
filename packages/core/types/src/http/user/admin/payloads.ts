export interface AdminCreateUser {
  email: string
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
}

export interface AdminUpdateUser {
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
}
