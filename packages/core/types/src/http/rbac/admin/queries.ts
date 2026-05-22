import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminRbacRoleListParams extends FindParams {
  /**
   * Query or keywords to search the role's searchable fields.
   */
  q?: string
  /**
   * Filter by role ID(s).
   */
  id?: string | string[]
  /**
   * Filter by role name(s).
   */
  name?: string | string[]
  /**
   * Filter by parent role ID(s).
   */
  parent_id?: string | string[]
  /**
   * Filter by the date the role was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the role was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the role was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminRbacRoleParams extends SelectParams {
  /**
   * Comma-separated relations to include in the response. Can include `policies`.
   */
  policies?: string | string[]
}

export interface AdminRbacPolicyListParams extends FindParams {
  /**
   * Query or keywords to search the policy's searchable fields.
   */
  q?: string
  /**
   * Filter by policy ID(s).
   */
  id?: string | string[]
  /**
   * Filter by policy key(s).
   */
  key?: string | string[]
  /**
   * Filter by resource(s).
   */
  resource?: string | string[]
  /**
   * Filter by operation(s).
   */
  operation?: string | string[]
  /**
   * Filter by the date the policy was created.
   */
  created_at?: OperatorMap<string>
  /**
   * Filter by the date the policy was updated.
   */
  updated_at?: OperatorMap<string>
  /**
   * Filter by the date the policy was deleted.
   */
  deleted_at?: OperatorMap<string>
}

export interface AdminRbacPolicyParams extends SelectParams {}
