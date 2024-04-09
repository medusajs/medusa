import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  AdminCustomerGroupListResponse,
  AdminCustomerGroupResponse,
} from "@medusajs/types"
import { z } from "zod"
import { CreateCustomerGroupSchema } from "../../v2-routes/customer-groups/customer-group-create/components/create-customer-group-form"
import { queryClient } from "../../lib/medusa"
import { EditCustomerGroupSchema } from "../../v2-routes/customer-groups/customer-group-edit/components/edit-customer-group-form"
import { customersQueryKeys } from "./customers"

const CUSTOMER_GROUPS_QUERY_KEY = "customer_groups" as const
const customerGroupsQueryKeys = queryKeysFactory(CUSTOMER_GROUPS_QUERY_KEY)

export const useCustomerGroup = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminCustomerGroupResponse,
      Error,
      AdminCustomerGroupResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customerGroupsQueryKeys.detail(id),
    queryFn: async () => client.customerGroups.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomerGroups = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminCustomerGroupListResponse,
      Error,
      AdminCustomerGroupListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.customerGroups.list(query),
    queryKey: customerGroupsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateCustomerGroup = (
  options?: UseMutationOptions<
    AdminCustomerGroupResponse,
    Error,
    z.infer<typeof CreateCustomerGroupSchema>
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.customerGroups.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCustomerGroup = (
  id: string,
  options?: UseMutationOptions<
    AdminCustomerGroupResponse,
    Error,
    z.infer<typeof EditCustomerGroupSchema>
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.customerGroups.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCustomerGroup = (
  id: string,
  options?: UseMutationOptions<
    { id: string; object: "customer-group"; deleted: boolean },
    Error,
    void
  >
) => {
  return useMutation({
    mutationFn: () => client.customerGroups.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddCustomersToGroup = (
  id: string,
  options?: UseMutationOptions<
    AdminCustomerGroupResponse,
    Error,
    { customer_ids: { id: string }[] }
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.customerGroups.addCustomers(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRemoveCustomersFromGroup = (
  id: string,
  options?: UseMutationOptions<
    AdminCustomerGroupResponse,
    Error,
    { customer_ids: { id: string }[] }
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.customerGroups.removeCustomers(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
