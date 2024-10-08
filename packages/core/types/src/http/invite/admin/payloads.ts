export type AdminAcceptInvite = {
  first_name: string
  last_name: string
}

export type AdminCreateInvite = {
  email: string
  metadata?: Record<string, unknown>
}
