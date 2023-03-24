/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from "../core/ModelUtils"

/**
 * Represents a User who can manage store settings.
 */
export interface User {
  /**
   * The user's ID
   */
  id: string
  /**
   * The user's role
   */
  role: "admin" | "member" | "developer"
  /**
   * The email of the User
   */
  email: string
  /**
   * The first name of the User
   */
  first_name: string | null
  /**
   * The last name of the User
   */
  last_name: string | null
  /**
   * An API token associated with the user.
   */
  api_token: string | null
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string
  /**
   * The date with timezone at which the resource was deleted.
   */
  deleted_at: string | null
  /**
   * An optional key-value map with additional details
   */
  metadata: Record<string, any> | null
}
