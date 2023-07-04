import { Customer, User } from ".."

export type AuthenticateResult = {
  success: boolean
  user?: User
  customer?: Customer
  error?: string
}
