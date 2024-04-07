import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import {
  CustomerGroupListRes,
  CustomerGroupRes,
} from "../../types/api-responses"

const CUSTOMER_GROUPS_QUERY_KEY = "customer_groups" as const
export const customerGroupsQueryKeys = queryKeysFactory(
  CUSTOMER_GROUPS_QUERY_KEY
)

export const useCustomerGroup = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<CustomerGroupRes, Error, CustomerGroupRes, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.customerGroups.retrieve(id, query),
    queryKey: customerGroupsQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomerGroups = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      CustomerGroupListRes,
      Error,
      CustomerGroupListRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.customerGroups.list(query),
    queryKey: customerGroupsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
