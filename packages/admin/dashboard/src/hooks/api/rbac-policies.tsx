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
import { queryKeysFactory } from "../../lib/query-key-factory"
import { rbacRolesQueryKeys } from "./rbac-roles"

const RBAC_POLICIES_QUERY_KEY = "rbac_policies" as const
const _rbacPoliciesQueryKeys = queryKeysFactory(
  RBAC_POLICIES_QUERY_KEY
) as ReturnType<typeof queryKeysFactory<"rbac_policies">> & {
  roles: (policyId: string, query?: any) => any[]
}

_rbacPoliciesQueryKeys.roles = function (policyId: string, query?: any) {
  return [this.detail(policyId), "roles", query].filter(Boolean)
}

export const rbacPoliciesQueryKeys = _rbacPoliciesQueryKeys

export const useRbacPolicy = (
  id: string,
  query?: HttpTypes.AdminRbacPolicyParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacPolicyResponse,
      FetchError,
      HttpTypes.AdminRbacPolicyResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.rbacPolicy.retrieve(id, query),
    queryKey: rbacPoliciesQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useRbacPolicies = (
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
    queryFn: () => sdk.admin.rbacPolicy.list(query),
    queryKey: rbacPoliciesQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateRbacPolicy = (
  options?: UseMutationOptions<
    HttpTypes.AdminRbacPolicyResponse,
    FetchError,
    HttpTypes.AdminCreateRbacPolicy
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.rbacPolicy.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacPoliciesQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateRbacPolicy = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacPolicyResponse,
    FetchError,
    HttpTypes.AdminUpdateRbacPolicy
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.rbacPolicy.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacPoliciesQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: rbacPoliciesQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteRbacPolicy = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminRbacPolicyDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.rbacPolicy.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: rbacPoliciesQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: rbacPoliciesQueryKeys.detail(id),
      })
      // Cross-invalidate roles since they may reference this policy
      queryClient.invalidateQueries({ queryKey: rbacRolesQueryKeys.all })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRbacPolicyRoles = (
  policyId: string,
  query?: HttpTypes.AdminRbacPolicyRoleListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacPolicyRolesListResponse,
      FetchError,
      HttpTypes.AdminRbacPolicyRolesListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.rbacPolicy.listRoles(policyId, query),
    queryKey: rbacPoliciesQueryKeys.roles(policyId, query),
    ...options,
  })

  return { ...data, ...rest }
}

const ASSIGNABLE_POLICIES_QUERY_KEY = ["rbac_assignable_policies"] as const

export const assignablePoliciesQueryKey = ASSIGNABLE_POLICIES_QUERY_KEY

/**
 * Fetches the policies the authenticated actor is allowed to assign.
 */
export const useRbacAssignablePolicies = (
  query?: HttpTypes.AdminRbacPolicyListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminRbacAssignablePoliciesListResponse,
      FetchError,
      HttpTypes.AdminRbacAssignablePoliciesListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryFn: () => sdk.admin.rbacPolicy.listAssignable(query),
    queryKey: [...ASSIGNABLE_POLICIES_QUERY_KEY, query],
    staleTime: 60 * 1000,
    ...options,
  })
}
