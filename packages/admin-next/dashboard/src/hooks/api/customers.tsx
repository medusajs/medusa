import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CreateCustomerReq, UpdateCustomerReq } from "../../types/api-payloads"
import { CustomerListRes, CustomerRes } from "../../types/api-responses"

const CUSTOMERS_QUERY_KEY = "customers" as const
const customersQueryKeys = queryKeysFactory(CUSTOMERS_QUERY_KEY)

export const useCustomer = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<CustomerRes, Error, CustomerRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.detail(id),
    queryFn: async () => client.customers.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomers = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<CustomerListRes, Error, CustomerListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.customers.list(query),
    queryKey: customersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateCustomer = (
  options?: UseMutationOptions<CustomerRes, Error, CreateCustomerReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.customers.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCustomer = (
  id: string,
  options?: UseMutationOptions<CustomerRes, Error, UpdateCustomerReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.customers.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
