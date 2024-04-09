import {
  AdminCustomerGroupListResponse,
  AdminCustomerGroupResponse,
} from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

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
