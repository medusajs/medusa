import { OperatorMap } from "../../../dal"
import { FindParams, SelectParams } from "../../common"

export interface AdminRbacScopeParams {
  /**
   * Filter by the type of scope.
   */
  scope?: string | string[]
  /**
   * Filter by the ID of the scope.
   */
  scope_id?: string | string[]
}

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

export interface AdminRbacPolicyListParams
  extends FindParams,
    AdminRbacScopeParams {
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

export interface AdminRbacAssignablePolicyListParams
  extends Omit<AdminRbacPolicyListParams, "scope" | "scope_id"> {
  /**
   * The type of the scope context assignability is evaluated within. Only
   * takes effect together with `scope_id`; otherwise the request's ambient
   * scope applies.
   */
  scope?: string
  /**
   * The ID of the scope context assignability is evaluated within. Only takes
   * effect together with `scope`.
   */
  scope_id?: string
}

export interface AdminRbacRoleUserListParams extends FindParams {
  /**
   * Filter by user ID(s).
   */
  user_id?: string | string[]
}

export interface AdminRbacPolicyRoleListParams extends FindParams {}

export interface AdminRbacRoleAssignmentListParams
  extends FindParams,
    AdminRbacScopeParams {
  /**
   * Filter by the type of entity the role is assigned to (e.g. `user`, `invite`).
   */
  reference?: string | string[]
  /**
   * Filter by the ID of the entity the role is assigned to.
   */
  reference_id?: string | string[]
}

export interface AdminRbacScopesParams {
  /**
   * The actor type from which to traverse grantees to resolve scopes.
   */
  actor_type: string
  /**
   * The grantee type to resolve scopes for.
   */
  grantee_type: string
}

export interface AdminRbacScopeOptionsParams extends AdminRbacScopesParams {
  /**
   * The actor ID to resolve scopes for.
   */
  actor_id: string
}
