import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminUserListParams extends FindParams {
  /**
   * Query or keywords to search the user's searchable fields.
   */
  q?: string
  /**
   * Filter by user ID(s).
   */
  id?: string | string[]
  /**
   * Filter by email(s).
   */
  email?: string | null
  /**
   * Filter by first name(s).
   */
  first_name?: string | null
  /**
   * Filter by last name(s).
   */
  last_name?: string | null
  /**
   * Filter by the date the user was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the user was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the user was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminUserParams extends SelectParams {}

export interface AdminGetUserRolesParams extends FindParams {
  role_id?: string | string[] | undefined
}
