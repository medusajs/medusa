/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminCreateUserRequest {
  /**
   * The User's email.
   */
  email: string
  /**
   * The first name of the User.
   */
  first_name?: string
  /**
   * The last name of the User.
   */
  last_name?: string
  /**
   * The role assigned to the user. These roles don't provide any different privileges.
   */
  role?: "admin" | "member" | "developer"
  /**
   * The User's password.
   */
  password: string
}
