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
}

_rbacRolesQueryKeys.policies = function (roleId: string, query?: any) {
  return [this.detail(roleId), "policies", query].filter(Boolean)
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
