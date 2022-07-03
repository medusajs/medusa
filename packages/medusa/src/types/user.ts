import { User, UserRoles } from "../models/user"
import { PartialPick } from "./common"

export interface CreateUserInput {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  api_token?: string
  role?: UserRoles
  metadata?: Record<string, unknown>
}

export interface UpdateUserInput {
  readonly email?: string
  first_name?: string
  last_name?: string
  readonly password_hash?: string
  api_token?: string
  role?: UserRoles
  metadata?: Record<string, unknown>
}

export enum UserRole {
  MEMBER = "member",
  ADMIN = "admin",
  DEVELOPER = "developer",
}

export type FilterableUserProps = PartialPick<
  User,
  | "email"
  | "first_name"
  | "last_name"
  | "created_at"
  | "updated_at"
  | "deleted_at"
>
