export type AcceptInviteInput = {
  payload: {
    first_name: string
    last_name: string
  }
  // Token for the created auth user
  token: string
}

export type CreateAuthUserInput = {
  email: string
  password: string
}
