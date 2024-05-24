import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { z } from "zod"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CreateCustomerGroupSchema } from "../../routes/customer-groups/customer-group-create/components/create-customer-group-form"
import { EditCustomerGroupSchema } from "../../routes/customer-groups/customer-group-edit/components/edit-customer-group-form"
import { customersQueryKeys } from "./customers"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"

const CUSTOMER_GROUPS_QUERY_KEY = "customer_groups" as const
export const customerGroupsQueryKeys = queryKeysFactory(
  CUSTOMER_GROUPS_QUERY_KEY
)

export const useCustomerGroup = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { customer_group: HttpTypes.AdminCustomerGroup },
      Error,
      { customer_group: HttpTypes.AdminCustomerGroup },
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
      PaginatedResponse<HttpTypes.AdminCustomerGroup[]>,
      Error,
      PaginatedResponse<HttpTypes.AdminCustomerGroup[]>,
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
    { customer_group: HttpTypes.AdminCustomerGroup },
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
    { customer_group: HttpTypes.AdminCustomerGroup },
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
    { customer_group: HttpTypes.AdminCustomerGroup },
    Error,
    { customer_ids: string[] }
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
    { customer_group: HttpTypes.AdminCustomerGroup },
    Error,
    { customer_ids: string[] }
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
