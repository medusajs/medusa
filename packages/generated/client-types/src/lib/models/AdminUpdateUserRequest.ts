/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

export interface AdminUpdateUserRequest {
  /**
   * The name of the User.
   */
  first_name?: string
  /**
   * The name of the User.
   */
  last_name?: string
  /**
   * Userrole assigned to the user.
   */
  role?: "admin" | "member" | "developer"
  /**
   * The api token of the User.
   */
  api_token?: string
  /**
   * An optional set of key-value pairs with additional information.
   */
  metadata?: Record<string, any>
}
