import { User } from "../models/user"

export interface CreateUserInput {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  password_hash: string
  api_token?: string
  metadata?: JSON
}

export interface UpdateUserInput {
  readonly email?: string
  first_name?: string
  last_name?: string
  readonly password_hash: string
  api_token?: string
  metadata?: JSON
}

export type FilterableUserProps = Omit<
  User,
  "password_hash" | "id" | "api_token" | "metadata"
>
