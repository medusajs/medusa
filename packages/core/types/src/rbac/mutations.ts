export type CreateRbacRoleDTO = {
  name: string
  description?: string | null
  metadata?: Record<string, unknown> | null
}

export type UpdateRbacRoleDTO = Partial<CreateRbacRoleDTO> & {
  id: string
}

export type CreateRbacPolicyDTO = {
  key: string
  resource: string
  operation: string
  name?: string | null
  description?: string | null
  metadata?: Record<string, unknown> | null
}

export type UpdateRbacPolicyDTO = Partial<CreateRbacPolicyDTO> & {
  id: string
}

export type CreateRbacRolePolicyDTO = {
  role_id: string
  policy_id: string
  metadata?: Record<string, unknown> | null
}

export type UpdateRbacRolePolicyDTO = Partial<CreateRbacRolePolicyDTO> & {
  id: string
}

export type CreateRbacRoleParentDTO = {
  role_id: string
  parent_id: string
  metadata?: Record<string, unknown> | null
}

export type UpdateRbacRoleParentDTO = Partial<CreateRbacRoleParentDTO> & {
  id: string
}
