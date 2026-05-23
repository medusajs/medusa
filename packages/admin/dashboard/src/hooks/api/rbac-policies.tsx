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
export const rbacPoliciesQueryKeys = queryKeysFactory(RBAC_POLICIES_QUERY_KEY)

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
