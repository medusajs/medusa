export type RbacRoleDTO = {
  id: string
  name: string
  description?: string | null
  metadata?: Record<string, unknown> | null
  policies?: RbacPolicyDTO[]
  deleted_at?: Date | string | null
}

export type FilterableRbacRoleProps = {
  id?: string | string[]
  name?: string
  q?: string
}

export type RbacPolicyDTO = {
  id: string
  key: string
  resource: string
  operation: string
  name?: string | null
  description?: string | null
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacPolicyProps = {
  id?: string | string[]
  key?: string | string[]
  resource?: string
  operation?: string
  q?: string
}

export type RbacRolePolicyDTO = {
  id: string
  role_id: string
  policy_id: string
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacRolePolicyProps = {
  id?: string | string[]
  role_id?: string | string[]
  policy_id?: string | string[]
}

export type RbacRoleParentDTO = {
  id: string
  role_id: string
  parent_id: string
  metadata?: Record<string, unknown> | null
}

export type FilterableRbacRoleParentProps = {
  id?: string | string[]
  role_id?: string | string[]
  parent_id?: string | string[]
}
