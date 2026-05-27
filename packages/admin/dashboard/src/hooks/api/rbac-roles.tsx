import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory, TQueryKey } from "../../lib/query-key-factory"

const RBAC_ROLES_QUERY_KEY = "rbac_roles" as const
const _rbacRolesQueryKeys = queryKeysFactory(
  RBAC_ROLES_QUERY_KEY
) as TQueryKey<"rbac_roles"> & {
  policies: (roleId: string, query?: any) => any[]
  users: (roleId: string, query?: any) => any[]
}

_rbacRolesQueryKeys.policies = function (roleId: string, query?: any) {
  return [this.detail(roleId), "policies", query].filter(Boolean)
}

_rbacRolesQueryKeys.users = function (roleId: string, query?: any) {
  return [this.detail(roleId), "users", query].filter(Boolean)
}

export const rbacRolesQueryKeys = _rbacRolesQueryKeys

export const useRbacRole = (
  id: string,
  query?: HttpTypes.AdminRbacRoleParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacRoleResponse,
      FetchError,
      HttpTypes.AdminRbacRoleResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.rbacRole.retrieve(id, query),
    queryKey: rbacRolesQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRbacRoles = (
  query?: HttpTypes.AdminRbacRoleListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacRoleListResponse,
      FetchError,
      HttpTypes.AdminRbacRoleListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.rbacRole.list(query),
    queryKey: rbacRolesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRbacRolePolicies = (
  roleId: string,
  query?: HttpTypes.AdminRbacPolicyListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacPolicyListResponse,
      FetchError,
      HttpTypes.AdminRbacPolicyListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.rbacRole.listPolicies(roleId, query),
    queryKey: rbacRolesQueryKeys.policies(roleId, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRbacRoleUsers = (
  roleId: string,
  query?: HttpTypes.AdminRbacRoleUserListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacRoleUserListResponse,
      FetchError,
      HttpTypes.AdminRbacRoleUserListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.rbacRole.listUsers(roleId, query),
    queryKey: rbacRolesQueryKeys.users(roleId, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateRbacRole = (
  options?: UseMutationOptions<
    HttpTypes.AdminRbacRoleResponse,
    FetchError,
    HttpTypes.AdminCreateRbacRole
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.rbacRole.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateRbacRole = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacRoleResponse,
    FetchError,
    HttpTypes.AdminUpdateRbacRole
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.rbacRole.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteRbacRole = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacRoleDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.rbacRole.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteRbacRoleLazy = (
  options?: UseMutationOptions<
    HttpTypes.AdminRbacRoleDeleteResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (id: string) => sdk.admin.rbacRole.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.details() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddRbacRolePolicies = (
  roleId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacPolicyListResponse,
    FetchError,
    HttpTypes.AdminAddRolePolicies
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.rbacRole.addPolicies(roleId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.policies(roleId),
      })
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.detail(roleId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddRbacRolePoliciesById = (
  options?: UseMutationOptions<
    HttpTypes.AdminRbacPolicyListResponse,
    FetchError,
    { roleId: string; policies: string[] }
  >
) => {
  return useMutation({
    mutationFn: ({ roleId, policies }) =>
      sdk.admin.rbacRole.addPolicies(roleId, { policies }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.policies(variables.roleId),
      })
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.detail(variables.roleId),
      })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRemoveRbacRolePolicy = (
  roleId: string,
  policyId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacPolicyDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.rbacRole.removePolicy(roleId, policyId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.policies(roleId),
      })
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.detail(roleId),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddRbacRoleUsers = (
  roleId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacRoleUsersResponse,
    FetchError,
    HttpTypes.AdminAssignRoleUsers["users"]
  >
) => {
  return useMutation({
    mutationFn: (users) => sdk.admin.rbacRole.addUsers(roleId, { users }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.users(roleId),
      })
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.detail(roleId),
      })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRemoveRbacRoleUsers = (
  roleId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacRoleUsersDeleteResponse,
    FetchError,
    HttpTypes.AdminRemoveRoleUsers["users"]
  >
) => {
  return useMutation({
    mutationFn: (users) => sdk.admin.rbacRole.removeUsers(roleId, { users }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.users(roleId),
      })
      queryClient.invalidateQueries({
        queryKey: rbacRolesQueryKeys.detail(roleId),
      })
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

const ME_PERMISSIONS_QUERY_KEY = ["me-permissions"] as const

export const mePermissionsQueryKey = ME_PERMISSIONS_QUERY_KEY

/**
 * Fetches the authenticated actor's resolved permission set. The response is always a flat list of `resource:operation` strings.
 */
export const useMePermissions = (
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacMePermissionsResponse,
      FetchError,
      HttpTypes.AdminRbacMePermissionsResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryFn: () => sdk.admin.rbacRole.mePermissions(),
    queryKey: mePermissionsQueryKey,
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

const ASSIGNABLE_ROLES_QUERY_KEY = ["rbac_assignable_roles"] as const

export const assignableRolesQueryKey = ASSIGNABLE_ROLES_QUERY_KEY

/**
 * Fetches the roles the authenticated actor is allowed to assign.
 */
export const useRbacAssignableRoles = (
  query?: HttpTypes.AdminRbacRoleListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacAssignableRolesListResponse,
      FetchError,
      HttpTypes.AdminRbacAssignableRolesListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryFn: () => sdk.admin.rbacRole.listAssignable(query),
    queryKey: [...ASSIGNABLE_ROLES_QUERY_KEY, query],
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
