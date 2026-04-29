import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"
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
import { customerGroupsQueryKeys } from "./customer-groups"

const CUSTOMERS_QUERY_KEY = "customers" as const
export const customersQueryKeys = queryKeysFactory(CUSTOMERS_QUERY_KEY)
export const customerAddressesQueryKeys = queryKeysFactory(
  `${CUSTOMERS_QUERY_KEY}-addresses`
)

export const useCustomer = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      { customer: HttpTypes.AdminCustomer },
      FetchError,
      { customer: HttpTypes.AdminCustomer },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersQueryKeys.detail(id),
    queryFn: async () => sdk.admin.customer.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomers = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>,
      FetchError,
      PaginatedResponse<{ customers: HttpTypes.AdminCustomer[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.customer.list(query),
    queryKey: customersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateCustomer = (
  options?: UseMutationOptions<
    { customer: HttpTypes.AdminCustomer },
    FetchError,
    HttpTypes.AdminCreateCustomer
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.customer.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCustomer = (
  id: string,
  options?: UseMutationOptions<
    { customer: HttpTypes.AdminCustomer },
    FetchError,
    HttpTypes.AdminUpdateCustomer
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.customer.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCustomer = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerDeleteResponse,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.customer.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchCustomerCustomerGroups = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerResponse,
    FetchError,
    HttpTypes.AdminBatchLink
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.customer.batchCustomerGroups(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.details(),
      })
      queryClient.invalidateQueries({
        queryKey: customerGroupsQueryKeys.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: customersQueryKeys.details(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateCustomerAddress = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerResponse,
    FetchError,
    HttpTypes.AdminCreateCustomerAddress
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.customer.createAddress(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) })
      queryClient.invalidateQueries({
        queryKey: customerAddressesQueryKeys.list(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCustomerAddress = (
  id: string,
  addressId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerResponse,
    FetchError,
    HttpTypes.AdminUpdateCustomerAddress
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      sdk.admin.customer.updateAddress(id, addressId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) })
      queryClient.invalidateQueries({
        queryKey: customerAddressesQueryKeys.list(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCustomerAddress = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminCustomerResponse,
    FetchError,
    string
  >
) => {
  return useMutation({
    mutationFn: (addressId: string) =>
      sdk.admin.customer.deleteAddress(id, addressId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(id) })
      queryClient.invalidateQueries({
        queryKey: customerAddressesQueryKeys.list(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useListCustomerAddresses = (
  id: string,
  options?: UseQueryOptions<
    HttpTypes.AdminCustomerAddressListResponse,
    FetchError,
    HttpTypes.AdminCustomerAddressListResponse,
    QueryKey
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.customer.listAddresses(id),
    queryKey: customerAddressesQueryKeys.list(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomerAddress = (
  id: string,
  addressId: string,
  options?: UseQueryOptions<
    HttpTypes.AdminCustomerResponse,
    FetchError,
    HttpTypes.AdminCustomerResponse,
    QueryKey
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.customer.retrieveAddress(id, addressId),
    queryKey: customerAddressesQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}
